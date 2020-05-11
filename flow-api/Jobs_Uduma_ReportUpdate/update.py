from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.models import Surveys, Forms, QuestionGroups, Questions, SurveyInstances, Answers
from resources.api import flow_api
from resources.utils import marktime, checktime, answer_handler
from resources.database import write_data, schema_generator
from resources.connection import engine_url

start_time = marktime()
api = flow_api()
token = api.get_token()
request_url = api.data_url
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()

formInstanceUrls = []

def collectSync(url, formChanged=[], formInstanceChanged=[], formInstanceDeleted=[], surveyDeleted=[]):
    data = api.sync_data(session, url, token)
    if data['status'] == 200:
        nextUrl = data['nextSyncUrl']
        formChanged = formChanged + data['changes']['formChanged']
        formInstanceChanged = formInstanceChanged + data['changes']['formInstanceChanged']
        formInstanceDeleted = formInstanceDeleted + data['changes']['formInstanceDeleted']
        surveyDeleted = surveyDeleted + data['changes']['surveyDeleted']
        print('FORM CHANGED: ' + str(len(formChanged)) +
              '| FORM INSTANCE CHANGED: ' + str(len(formInstanceChanged)) +
              '| FORM INSTANCE DELETED: '+ str(len(formInstanceDeleted)) +
              '| SURVEY DELETED: '+ str(len(surveyDeleted))
             )
        return collectSync(nextUrl, formChanged, formInstanceChanged, formInstanceDeleted, surveyDeleted)
    else:
        results = {'nextSyncUrl': url}
        if len(formChanged) > 0:
            results.update({'formChanged':formChanged})
        if len(formInstanceChanged) > 0:
            results.update({'formInstanceChanged':formInstanceChanged})
        if len(formInstanceDeleted) > 0:
            results.update({'formInstanceDeleted':formInstanceDeleted})
        if len(surveyDeleted) > 0:
            results.update({'surveyDeleted':surveyDeleted})
        return results

print(checktime(start_time) + ' COLLECTING DATA')
next_sync = api.cursor_get(session)
sync_history = collectSync(next_sync)
api.cursor_update(session, sync_history)
print(checktime(start_time) + ' DONE COLLECTING')
print('======================================')

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
    print(checktime(start_time) + ' GETTING FOLDERS')
    for form in survey_changed:
        survey = session.query(Surveys).filter(Surveys.id == form['surveyId']).first()
        survey_id = None
        if survey is None:
            survey = api.get_data(request_url + '/surveys/' + form['surveyId'], token)
            survey_id = survey['id']
            if survey['registrationFormId'] == "":
                survey.update({'registrationFormId':0})
            input_data = Surveys(survey)
            write_data(session, input_data, survey, "SURVEY")
        else:
            survey_id = survey.id
        form.update({'survey_id':survey_id})
        available_form = session.query(Forms).filter(Forms.id == form['id']).first()
        if available_form == None:
            input_data = Forms(form)
            write_data(session, input_data, form, False)
        else:
            available_form.name = form['name']
        for qgroup in form['questionGroups']:
            available_group = session.query(QuestionGroups).filter(QuestionGroups.id == qgroup['id']).first()
            if available_group == None:
                qgroup.update({'form_id':form['id']})
                input_data = QuestionGroups(qgroup)
                write_data(session, input_data, qgroup, False)
            else:
                available_form.name = qgroup['name']
            for question in qgroup['questions']:
                available_question = session.query(Questions).filter(Questions.id == question['id']).first()
                if available_question == None:
                    question.update({'group_id':qgroup['id']})
                    question.update({'form_id':form['id']})
                    input_data = Questions(question)
                    write_data(session, input_data, question, False)
                else:
                    available_question.name = question['name']
                    available_question.type = question['type']

def update_survey_data(survey_instance_changed):
    print(checktime(start_time) + ' GETTING SURVEY INSTANCES')
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
    print(checktime(start_time) + ' SURVEY INSTANCES RECORDED')

clear = False

if 'formChanged' in sync_history:
    update_survey_meta(sync_history['formChanged'])
    session.commit()
    clear = True
if 'formInstanceChanged' in sync_history:
    update_survey_data(sync_history['formInstanceChanged'])
    session.commit()
    clear = True
if 'formInstanceDeleted' in sync_history:
    ids = [int(x) for x in sync_history['formInstanceDeleted']]
    session.query(Answers).filter(Answers.survey_instance_id._in(ids)).delete(synchronize_session='evaluate')
    session.query(SurveyInstances).filter(SurveyInstances.id._in(ids)).delete(synchronize_session='evaluate')
    session.commit()
    clear = True
if 'surveyDeleted' in sync_history:
    ids = [int(x) for x in sync_history['surveyDeleted']]
    for id in ids:
        session.query(Questions).filter(Questions.survey_instance_id == id).delete(synchronize_session='evaluate')
        session.query(SurveyInstances).filter(SurveyInstances.id == id).delete(synchronize_session='evaluate')
        session.commit()
    clear = True

if clear:
    print(checktime(start_time) + ' GENERATING NEW SCHEMA')
    schema_generator(session, engine)
    print(checktime(start_time) + ' NEW SCHEMA IS GENERATED')

print(checktime(start_time) + ' JOB IS FINISHED')
