from datetime import datetime
import time
import pandas as pd
import requests as r
import logging
import os
import savReaderWriter as spss
from app.FlowHandler import FlowHandler

INSTANCE = "seasiapac-basic"
SURVEYID = "312920912"
FORMID = "288920912"
SECRET = {
    "client_id": "curl",
    "username": os.environ['KEYCLOAK_USER'],
    "password": os.environ['KEYCLOAK_PWD'],
    "grant_type": "password",
    "scope": "openid offline_access"
}
TOKEN = "https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token"
dataPoints = []

requestURI = 'https://api.akvo.org/flow/orgs/' + INSTANCE + '/surveys/' + SURVEYID
formURI = 'https://api.akvo.org/flow/orgs/' + INSTANCE + '/form_instances?survey_id=' + SURVEYID + '&form_id=' + FORMID

start_time = time.time()

def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent

def refreshData():
    tokens = r.post(TOKEN, SECRET).json();
    return tokens['refresh_token']

def getAccessToken():
    account = {
        'client_id':'curl',
        'refresh_token': refreshData(),
        'grant_type':'refresh_token'
    }
    try:
        account = r.post(TOKEN, account).json();
    except:
        logging.error('FAILED: TOKEN ACCESS UNKNOWN')
        return False
    return account['access_token']

def getResponse(url):
    header = {
        'Authorization':'Bearer ' + getAccessToken(),
        'Accept': 'application/vnd.akvo.flow.v2+json',
        'User-Agent':'python-requests/2.14.2'
    }
    response = r.get(url, headers=header).json()
    return response

def getAll(url):
    data = getResponse(url)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        url = data.get('nextPageUrl')
        getAll(url)
    except:
        return "done"

def download():
    apiData = getResponse(requestURI).get('forms')
    questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
    details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
    meta = questions(apiData[0]['questionGroups'])
    mt = pd.DataFrame(meta)
    groupID = mt['id'][0]
    metadata = mt['questions'][0]
    getAll(formURI)
    output = pd.DataFrame(dataPoints)
    for qst in metadata:
        qName = qst['name'].replace('_',' ')
        qId = str(qst['id'])
        qType = qst['type']
        output[qName] = output['responses'].apply(lambda x: FlowHandler(x[groupID],qId,qType))
        if qType == 'GEO':
            output[qName+'_lat'] = output[qName].apply(lambda x: x[0] if x is not None else x)
            output[qName+'_long'] = output[qName].apply(lambda x: x[1] if x is not None else x)
            output = output.drop([qName], axis=1)
    output = output.drop(['responses'], axis=1)
    csv_filename = "_".join([INSTANCE,SURVEYID, FORMID]) + ".csv"
    csv_output = datetime.strftime(datetime.now(), "%Y_%m_%d_%H%m_" + csv_filename)
    output.to_csv(csv_output, index=False)
    return output

## API to Get Json Questionnaire
## Contact: Deden Bangkit

form = r.get('http://127.0.0.1:5000/' + INSTANCE + '/' + FORMID + '/en').json()
data = download()

valueLabels = {}
valueLabelsData = []
for question in form['questionGroup']['question']:
    try:
        option = question['options']
        if ~option['allowMultiple']:
            byte_question = question['text'].encode()
            valueLabelsData.append(question['text'])
            get_objects = lambda x: {int(y['code']):y['text'].encode() for y in x}
            objects = get_objects(option['option'])
            valueLabels.update({byte_question:objects})
    except:
        pass

varTypes = {}
for valLabel in valueLabelsData:
    varTypes.update({valLabel.encode(): 0})
    data[valLabel] = data[valLabel].apply(lambda x: int(x.split(':')[0]))

nonLabels = []
[nonLabels.append(y) if y not in valueLabelsData else False for y in list(data)]
str_columns = data[nonLabels].select_dtypes(exclude=['float','int'])
int_columns = data[nonLabels].select_dtypes(include=['float','int'])

for int_column in int_columns:
    varTypes.update({int_column.encode(): 0})
for str_column in str_columns:
    varTypes.update({str_column.encode(): 5})
    data[str_column] = data[str_column].apply(lambda x:x.encode())

records = data.to_dict('split')['data']
varNames = [y.encode() for y in list(data)]
Labels = {}
for varName in varNames:
    Labels.update({varName:varName})

savFileName = INSTANCE + '_' + FORMID + '.sav'
with spss.SavWriter(savFileName,
                    varNames,
                    varTypes,
                    valueLabels=valueLabels,
                    varLabels=Labels) as writer:
    for record in records:
        writer.writerow(record)

