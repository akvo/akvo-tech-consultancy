from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.models import Surveys, Forms, QuestionGroups, Questions, SurveyInstances, Answers
from resources.api import flow_api
from resources.utils import marktime, checktime, answer_handler
from resources.database import write_data, clear_schema, schema_generator, get_summary
from resources.connection import engine_url

start_time = marktime()
api = flow_api()
token = api.get_token()
request_url = api.data_url
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()

next_sync = api.cursor_get(session)
new_data = api.sync_data(session, next_sync, token)
sync_history = api.get_history(session)
formInstanceUrls = []

def check_and_update(Model, data):
    stored_data = session.query(Model).filter(Model.id == int(data['id'])).first()
    if stored_data == None:
        input_data = Model(data)
        write_data(session, input_data, data, False)

def saveAnswers(group, index, instance):
    for qid in [*group]:
        question = session.query(Questions).filter(Questions.id == int(qid)).first()
        answer = {
            'survey_instance_id': instance['id'],
            'question_id': qid,
            'repeat_index': index
        }
        answer_value = ''
        if group[qid]:
            answer_value = answer_handler(group, qid, question.type)
            answer_value = str(answer_value)
        answer.update({'value':answer_value})
        input_data = Answers(answer)
        write_data(session, input_data, answer, False)

def update_survey_meta(survey_changed):
    print('GETTING FOLDERS: ' + checktime(start_time))
    folders = api.get_data(request_url + '/folders', token)
    new_surveys = []
    for sc in survey_changed:
        for folder in folders['folders']:
            survey_url_check = []
            if folder['id'] == sc['id']:
                survey_collections = api.check_folders(folder['foldersUrl'], folder['surveysUrl'], token)
                survey_url_check.append(survey_collections)
            for survey_url in survey_url_check:
                surveys = api.get_data(survey_url, token)
                for survey in surveys['surveys']:
                    new_surveys.append(survey)
        for survey in new_surveys:
            if survey['id'] == sc['id']:
                data = api.get_data(survey['surveyUrl'], token)
                for form in data['forms']:
                    form.update({'survey_id':data['id']})
                    check_and_update(Forms, form)
                    for qgroup in form['questionGroups']:
                        qgroup.update({'form_id':form['id']})
                        check_and_update(QuestionGroups, qgroup)
                        for question in qgroup['questions']:
                            question.update({'group_id':qgroup['id'],'form_id':form['id']})
                            check_and_update(Questions, question)
                        formInstanceUrls.append({
                            'formInstancesUrl': form['formInstancesUrl'],
                            'form_id': form['id']
                        })
                print('GETTING {}: {}'.format(data['name'],checktime(start_time)))
                if data['registrationFormId'] == "":
                    data.update({'registrationFormId':0})
                stored_survey = session.query(Surveys).filter(Surveys.id == int(data['id'])).first()
                if stored_survey:
                    stored_survey.registration_id = data['registrationFormId']
                    stored_survey.name = data['name']
                    session.add(stored_survey)
                    session.commit()
                    print('SURVEY UPDATED: {}'.format(data['name']))
                else:
                    input_data = Surveys(data)
                    print('NEW SURVEY FOUND: {}'.format(data['name']))
                    write_data(session, input_data, data, "SURVEY")

def update_survey_data(survey_instance_changed):
    print('GETTING SURVEY INSTANCES: ' + checktime(start_time))
    for instance in survey_instance_changed:
        check_and_update(SurveyInstances, instance)
        answers = instance['responses']
        if answers is not None:
            stored_answers = session.query(Answers).filter(Answers.survey_instance_id == instance['id'])
            stored_answers.delete(synchronize_session='evaluate')
            for group_id in [*answers]:
                saved_group = session.query(QuestionGroups).filter(QuestionGroups.id == group_id).first()
                saved_questions = session.query(Questions).filter(Questions.question_group_id == group_id).all()
                for index, group in enumerate(answers[group_id], start=1):
                    if saved_group.repeat == False:
                        index = 0
                    if saved_group.repeat:
                        for saved_question in saved_questions:
                            group.update({saved_question.id: None})
                    saveAnswers(group, index, instance)
    print('SURVEY INSTANCES RECORDED: ' + checktime(start_time))

clear = False

if 'formChanged' in sync_history.data:
    clear = True
    update_survey_meta(sync_history.data['formChanged'])
if 'formInstanceChanged' in sync_history.data:
    clear = True
    update_survey_data(sync_history.data['formInstanceChanged'])
if 'formInstanceDeleted' in sync_history.data:
    clear = True
    ids = [int(x) for x in sync_history.data['formInstanceDeleted']]
    session.query(Answers).filter(Answers.survey_instance_id._in(ids)).delete(synchronize_session='evaluate')
    session.query(SurveyInstances).filter(SurveyInstances.id._in(ids)).delete(synchronize_session='evaluate')
    session.commit()
if 'surveyDeleted' in sync_history.data:
    clear = True
    ids = [int(x) for x in sync_history.data['surveyDeleted']]
    for id in ids:
        session.query(Questions).filter(Questions.survey_instance_id == id).delete(synchronize_session='evaluate')
        session.query(SurveyInstances).filter(SurveyInstances.id == id).delete(synchronize_session='evaluate')
        session.commit()

if clear:
    clear_schema(engine)
    schema_generator(session, engine)

get_summary(session)
