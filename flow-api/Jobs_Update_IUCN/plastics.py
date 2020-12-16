import requests as r
import pandas as pd
import time
import os
import sys
from datetime import datetime
from Akvo import Flow
from FlowHandler import FlowHandler
import pprint

pp = pprint.PrettyPrinter(indent=4)

APIKEY='&api_key='+os.environ['CARTO_KEY']
CARTOURL='https://akvo.cartodb.com/api/v2/sql?q='
# DATABASEID = "test_iucn_plastics"
DATABASEID = "iucn_plastics_249830001"
INSTANCE='iucn'
SURVEYID='239480001'
FORMID='249830001'


requestURI = 'https://api-auth0.akvo.org/flow/orgs/' + INSTANCE + '/surveys/' + SURVEYID
formURI = 'https://api-auth0.akvo.org/flow/orgs/' + INSTANCE + '/form_instances?survey_id=' + SURVEYID + '&form_id=' + FORMID

FlowToken = Flow.getToken()
if FlowToken == "Error":
    print("TOKEN ERROR");
    sys.exit(1);

def getTime(x):
    return int(datetime.strptime(x, '%Y-%m-%dT%H:%M:%SZ').strftime("%s%f")) / 1000

def getAll(url):
    data = Flow.getResponse(url, FlowToken)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        url = data.get('nextPageUrl')
        getAll(url)
    except:
        return "done"

dataPoints = []
question_columns = ['identifier','instance','submitter','collection_date','latitude','longitude']
def download():
    apiData = Flow.getResponse(requestURI, FlowToken).get('forms')
    questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
    details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
    meta = questions(apiData[0]['questionGroups'])
    mt = pd.DataFrame(meta)
    groupID = mt['id'][0]
    groupID2 = mt['id'][1]
    metadata = mt['questions'][0]
    metadata2 = mt['questions'][1]
    getAll(formURI)
    output = pd.DataFrame(dataPoints)
    number_columns = []
    for qst in metadata:
        qName = 'q' + str(qst['id'])
        qId = str(qst['id'])
        qType = qst['type']
        output[qName] = output['responses'].apply(lambda x: FlowHandler(x, groupID,qId,qType))
        if qType == 'NUMBER':
            number_columns.append(qName)
        if qType == 'GEO':
            output['latitude'] = output[qName].apply(lambda x: x[0] if x is not None else x)
            output['longitude'] = output[qName].apply(lambda x: x[1] if x is not None else x)
            output = output.drop([qName], axis=1)
        else:
            question_columns.append(qName)

    for qst in metadata2:
        qName = 'q' + str(qst['id'])
        qId = str(qst['id'])
        qType = qst['type']
        output[qName] = output['responses'].apply(lambda x: FlowHandler(x, groupID2,qId,qType))
        if qType == 'NUMBER':
            number_columns.append(qName)
        if qType == 'GEO':
            output['latitude'] = output[qName].apply(lambda x: x[0] if x is not None else x)
            output['longitude'] = output[qName].apply(lambda x: x[1] if x is not None else x)
            output = output.drop([qName], axis=1)
        else:
            question_columns.append(qName)

    output['collection_date'] = output['submissionDate'].apply(getTime)
    output = output.drop(['responses','submissionDate','id','modifiedAt','createdAt','displayName','surveyalTime','deviceIdentifier'], axis=1)
    output = output.rename(columns={"dataPointId":"instance"})
    output = output[question_columns]
    return output

def append_columns():
    for q in ["q14290003", "q22270002", "q18380002", "q30000004", "q9910003", "q5930003", "q22250002", "q9770001"]:
        query = "ALTER TABLE " + DATABASEID + " ADD " + q + " text;"
        newcolumn = r.get(CARTOURL + query + APIKEY)
        print(newcolumn.json())
        time.sleep(1)

data = download()

def str_list(x, column):
    x = str(x).replace("[","").replace("]","").replace("None","null").replace("nan","null").replace('"','')
    if column:
        return x.replace("'","")
    return x.replace("'","$$")

column_list = str_list(question_columns, True)
truncate = r.get(CARTOURL + "TRUNCATE TABLE " + DATABASEID + " RESTART IDENTITY;" + APIKEY)
print(truncate.text)

increment = 0
for g in data.to_dict('split')['data']:
    increment += 1
    query = "INSERT INTO " + DATABASEID + " (" + column_list + ") SELECT "
    query +=  str_list(g, False) + " WHERE NOT EXISTS (SELECT instance FROM " + DATABASEID + " WHERE instance ='" + g[1] + "');"
    try:
        new_row = r.get(CARTOURL + query + APIKEY)
        print(str(increment) + '. ' + str(g[1]) + " - " + str(new_row.status_code) + str(new_row.text))
        time.sleep(1)
    except:
        print(str(increment) + '. ' + str(g[1]) + " - FAILED")

update_geom = "UPDATE " + DATABASEID + " SET the_geom = ST_SetSRID(st_makepoint(longitude,latitude),4326)";
update_geom = r.get(CARTOURL + update_geom + APIKEY)
print(str(update_geom.json()).replace("{","").replace("}","").replace(":","= "))
