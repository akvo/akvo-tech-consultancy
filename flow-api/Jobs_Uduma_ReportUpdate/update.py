from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.models import Surveys, QuestionGroups, Questions, SurveyInstances, Answers, Forms
from resources.api import flow_api, flow_sync
from resources.utils import marktime, checktime, answer_handler
from resources.database import write_data, clear_schema, schema_generator
from resources.connection import engine_url

start_time = marktime()
instance_name = 'uat2'
api = flow_api()
sync = flow_sync()
request_url = api.get_instance_url(instance_name)
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()

next_sync = sync.cursor_get(session)
sync_token = sync.get_token()
new_data = sync.get_data(session, next_sync, sync_token)
sync_history = sync.get_history(session)
formInstanceUrls = []

def saveAnswers(group, index, instance):
    for qid in [*group]:
        question = session.query(Questions).filter(Questions.id == int(qid)).first()
        answer_value = answer_handler(group, qid, question.type)
        answer_value = str(answer_value)
        answer = {
            'survey_instance_id': instance['id'],
            'question_id': qid,
            'value': answer_value,
            'repeat_index': index
        }
        input_data = Answers(answer)
        write_data(session, input_data, answer, False)

def check_and_update(Model, data):
    stored_data = session.query(Model).filter(Model.id == int(data['id'])).first()
    if stored_data == None:
        input_data = Model(data)
        write_data(session, input_data, data, False)

def update_survey_meta(survey_changed):
    print('GETTING FOLDERS: ' + checktime(start_time))
    api_token = api.get_token()
    api_token = api.check_token(api_token)
    folders = api.get_data(request_url + '/folders', api_token)
    new_surveys = []
    for sc in survey_changed:
        for folder in folders['folders']:
            survey_url_check = []
            if folder['id'] == sc['id']:
                api_token = api.check_token(api_token)
                survey_collections = api.check_folders(folder['foldersUrl'], folder['surveysUrl'], api_token)
                survey_url_check.append(survey_collections)
            for survey_url in survey_url_check:
                api_token = api.check_token(api_token)
                surveys = api.get_data(survey_url, api_token)
                for survey in surveys['surveys']:
                    new_surveys.append(survey)
        for survey in new_surveys:
            if survey['id'] == sc['id']:
                data = api.get_data(survey['surveyUrl'], api_token)
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

if sync_history.data['formChanged']:
    update_survey_meta(sync_history.data['formChanged'])
if sync_history.data['formInstanceChanged']:
    update_survey_data(sync_history.data['formInstanceChanged'])
if sync_history.data['formInstanceDeleted']:
    ids = [int(x) for x in sync_history.data['formInstanceDeleted']]
    session.query(Answers).filter(Answers.survey_instance_id._in(ids)).delete(synchronize_session='evaluate')
    session.query(SurveyInstances).filter(SurveyInstances.id._in(ids)).delete(synchronize_session='evaluate')
    session.commit()
if sync_history.data['surveyDeleted']:
    ids = [int(x) for x in sync_history.data['surveyDeleted']]
    for id in ids:
        session.query(Questions).filter(Questions.survey_instance_id == id).delete(synchronize_session='evaluate')
        session.query(SurveyInstances).filter(SurveyInstances.id == id).delete(synchronize_session='evaluate')
        session.commit()

clear_schema(engine)
schema_generator(session, engine)

