from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.models import Surveys, Forms, QuestionGroups, Questions, SurveyInstances, Answers
from resources.api import flow_api
from resources.utils import marktime, checktime, answer_handler
from resources.database import write_data, table_column_regex, clear_schema
from resources.connection import engine_url
from collections import ChainMap
import pandas as pd

instance_name = 'uat2'
api = flow_api()
request_url = api.get_instance_url(instance_name)
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()
getter = sessionmaker(bind=engine)()

surveysUrl = []
token = api.get_new_token()
start_time = marktime()

def getFolders(items, token):
    for folder in items['folders']:
        try:
            surveysUrl.append(folder['surveysUrl'])
            token = api.check_token(token)
            childs = api.get_data(folder['foldersUrl'], token)
            getFolders(childs, token)
        except:
            pass

print('GETTING FOLDER LIST: ' + checktime(start_time))
token = api.check_token(token)
parents = api.get_data(request_url + '/folders', token)
getFolders(parents, token)
print('FOLDER IS POPULATED: ' + checktime(start_time))

surveys = []
print('GETTING SURVEY LIST: ' + checktime(start_time))
for surveyUrl in surveysUrl:
    token = api.check_token(token)
    surveyList = api.get_data(surveyUrl, token)
    for survey in surveyList['surveys']:
        surveys.append(survey)
print('SURVEY IS POPULATED: ' + checktime(start_time))

print('RECORDING SURVEY: ' + checktime(start_time))
formInstanceUrls = []
for url in surveys:
    token = api.check_token(token)
    print('FETCH {}: {}'.format(url['surveyUrl'], checktime(start_time)))
    data = api.get_data(url['surveyUrl'], token)
    if data['registrationFormId'] == "":
        data.update({'registrationFormId':0})
    input_data = Surveys(data)
    write_data(session, input_data, data, "SURVEY")
    for form in data['forms']:
        form.update({'survey_id':data['id']})
        input_data = Forms(form)
        write_data(session, input_data, form, False)
        for qgroup in form['questionGroups']:
            qgroup.update({'form_id':form['id']})
            input_data = QuestionGroups(qgroup)
            write_data(session, input_data, qgroup, False)
            for question in qgroup['questions']:
                question.update({'group_id':qgroup['id']})
                question.update({'form_id':form['id']})
                input_data = Questions(question)
                write_data(session, input_data, question, False)
        formInstanceUrls.append({
            'formInstancesUrl': form['formInstancesUrl'],
            'form_id': form['id']
        })
print('SURVEY IS RECORDED: ' + checktime(start_time))

def saveAnswers(group, index):
    for qid in [*group]:
        question = getter.query(Questions).filter(Questions.id == int(qid)).first()
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

print('GETTING SURVEY INSTANCES: ' + checktime(start_time))
for data in formInstanceUrls:
    token = api.check_token(token)
    formInstances = api.get_data(data['formInstancesUrl'], token)
    formInstancesData = formInstances['formInstances']
    while 'nextPageUrl' in formInstances:
        token = api.check_token(token)
        nextPageData = api.get_data(formInstances['nextPageUrl'], token)
        formInstancesData += nextPageData['formInstances']
        formInstances = nextPageData
    for instance in formInstancesData:
        input_data = SurveyInstances(instance)
        write_data(session, input_data, instance, "SURVEY INSTANCES")
        answers = instance['responses']
        if answers is not None:
            for group_id in [*answers]:
                for index, group in enumerate(answers[group_id], start=1):
                    saveAnswers(group, index)
print('SURVEY INSTANCES RECORDED: ' + checktime(start_time))
