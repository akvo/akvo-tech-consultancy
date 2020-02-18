from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from resources.models import Surveys, Forms, QuestionGroups, Questions, SurveyInstances, Answers
from resources.api import flow_api
from resources.utils import marktime, checktime, answer_handler
from resources.database import write_data, schema_generator, get_summary
from resources.connection import engine_url

api = flow_api()
main_url = api.data_url
engine_url = engine_url()
engine = create_engine(engine_url)
session = sessionmaker(bind=engine)()
getter = sessionmaker(bind=engine)()

surveysUrl = []
token = api.get_token()
start_time = marktime()

def getFolders(items, token):
    for folder in items['folders']:
        try:
            surveysUrl.append(folder['surveysUrl'])
            childs = api.get_data(folder['foldersUrl'], token)
            getFolders(childs, token)
        except:
            pass

def saveAnswers(group, index):
    for qid in [*group]:
        question = getter.query(Questions).filter(Questions.id == int(qid)).first()
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

## INIT GETTING FOLDER LIST

print('GETTING FOLDER LIST: ' + checktime(start_time))
parents = api.get_data(main_url + '/folders', token)
getFolders(parents, token)
print('FOLDER IS POPULATED: ' + checktime(start_time))

surveys = []

print('GETTING SURVEY LIST: ' + checktime(start_time))
for surveyUrl in surveysUrl:
    surveyList = api.get_data(surveyUrl, token)
    for survey in surveyList['surveys']:
        surveys.append(survey)
print('SURVEY IS POPULATED: ' + checktime(start_time))

## INIT RECORDING SURVEY

print('RECORDING SURVEY: ' + checktime(start_time))
formInstanceUrls = []
for url in surveys:
    data = api.get_data(url['surveyUrl'], token)
    print('GETTING {}: {}'.format(data['name'],checktime(start_time)))
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

# INIT RECORDING DATA

print('GETTING SURVEY INSTANCES: ' + checktime(start_time))
for data in formInstanceUrls:
    formInstances = api.get_data(data['formInstancesUrl'], token)
    formInstancesData = formInstances['formInstances']
    while 'nextPageUrl' in formInstances:
        nextPageData = api.get_data(formInstances['nextPageUrl'], token)
        formInstancesData += nextPageData['formInstances']
        formInstances = nextPageData
    for instance in formInstancesData:
        input_data = SurveyInstances(instance)
        write_data(session, input_data, instance, "SURVEY INSTANCES")
        answers = instance['responses']
        if answers is not None:
            for group_id in [*answers]:
                saved_group = getter.query(QuestionGroups).filter(QuestionGroups.id == group_id).first()
                saved_questions = getter.query(Questions).filter(Questions.question_group_id == group_id).all()
                for index, group in enumerate(answers[group_id], start=1):
                    if saved_group.repeat == False:
                        index = 0
                    if saved_group.repeat:
                        for saved_question in saved_questions:
                            group.update({saved_question.id: None})
                    saveAnswers(group, index)
print('SURVEY INSTANCES RECORDED: ' + checktime(start_time))

schema_generator(session, engine)
api.init_sync(session, token)
get_summary(session)
