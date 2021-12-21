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

APIKEY = '&api_key=' + os.environ['CARTO_KEY']
CARTOURL = 'https://akvo.cartodb.com/api/v2/sql?q='
# DATABASEID = "test_iucn_tof"
DATABASEID = "tof_28030003"
INSTANCE = 'iucn'
SURVEYID = '550001'
FORMID = '28030003'

AUTH0_URL = 'https://api-auth0.akvo.org/flow/orgs'

requestURI = f'{AUTH0_URL}/{INSTANCE}/surveys/{SURVEYID}'
formURI = f'{AUTH0_URL}/{INSTANCE}'
formURI += f'/form_instances?survey_id={SURVEYID}'
formURI += f'&form_id={FORMID}'

FlowToken = Flow.getToken()
if FlowToken == "Error":
    print("TOKEN ERROR")
    sys.exit(1)


def getTime(x):
    return int(datetime.strptime(x,
                                 '%Y-%m-%dT%H:%M:%SZ').strftime("%s%f")) / 1000


def getAll(url):
    data = Flow.getResponse(url, FlowToken)
    cursor = url.split("&")[-1]
    print(cursor)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        getAll(data['nextPageUrl'])
    except KeyError:
        return "done"


dataPoints = []
question_columns = [
    'identifier', 'instance', 'submitter', 'collection_date', 'latitude',
    'longitude'
]


def details(x):
    return [{
        'id': a['id'],
        'name': a['name'].replace(' ', '_'),
        'type': a['type']
    } for a in x]


def questions(x):
    return [{
        'id': a['id'],
        'name': a['name'],
        'questions': details(a['questions'])
    } for a in x]


def download():
    apiData = Flow.getResponse(requestURI, FlowToken).get('forms')
    meta = questions(apiData[0]['questionGroups'])
    mt = pd.DataFrame(meta)
    groupID = mt['id'][0]
    metadata = mt['questions'][0]
    getAll(formURI)
    output = pd.DataFrame(dataPoints)
    number_columns = []
    for qst in metadata:
        qName = 'q' + str(qst['id'])
        qId = str(qst['id'])
        qType = qst['type']
        output[qName] = output['responses'].apply(
            lambda x: FlowHandler(x, groupID, qId, qType))
        if qType == 'NUMBER':
            number_columns.append(qName)
        if qType == 'GEO':
            output['latitude'] = output[qName].apply(lambda x: x[0]
                                                     if x is not None else x)
            output['longitude'] = output[qName].apply(lambda x: x[1]
                                                      if x is not None else x)
            output = output.drop([qName], axis=1)
        else:
            question_columns.append(qName)
    output['collection_date'] = output['submissionDate'].apply(getTime)
    output = output.drop([
        'responses', 'submissionDate', 'id', 'modifiedAt', 'createdAt',
        'displayName', 'surveyalTime', 'deviceIdentifier'
    ],
                         axis=1)
    output = output.rename(columns={"dataPointId": "instance"})
    output = output[question_columns]
    return output


def append_columns():
    # last_append = [
    #    "q14290003", "q22270002", "q18380002", "q30000004", "q9910003",
    #    "q5930003", "q22250002", "q9770001"
    # ]
    new_append = ["q398750071", "q403770079"]
    for q in new_append:
        query = "ALTER TABLE " + DATABASEID + " ADD " + q + " text;"
        newcolumn = r.get(CARTOURL + query + APIKEY)
        print(newcolumn.json())
        time.sleep(1)


print('Starting download...')
data = download()
data[data['q4800002'] == 'Result'].to_dict('records')

print('Append column...')
# append_columns()


def str_list(x, column):
    x = str(x).replace("[", "")
    x = x.replace("]", "")
    x = x.replace("None", "null")
    x = x.replace("nan", "null")
    x = x.replace('"', '')
    if column:
        return x.replace("'", "")
    if ": # " in x:
        return x.replace("'", "$$").replace(": # ", " - ")
    return x.replace("'", "$$")


column_list = str_list(question_columns, True)
truncate = r.get(
    f"{CARTOURL}TRUNCATE TABLE {DATABASEID} RESTART IDENTITY; {APIKEY}")
if truncate.status_code == 200:
    truncate = truncate.json()
    total_rows = truncate['total_rows']
    print(f"DATA TRUNCATED {total_rows}")
else:
    print("DATA TRUNCATE FAILED")
    sys.exit(1)

for i, g in enumerate(data.to_dict('split')['data']):
    increment = i + 1
    gid = g[1]
    query = f"INSERT INTO {DATABASEID} ({column_list}) SELECT "
    query += str_list(g, False)
    query += " WHERE NOT EXISTS "
    query += f"(SELECT instance FROM {DATABASEID} WHERE instance = '"
    query += g[1]
    query += "');"
    try:
        new_row = r.get(CARTOURL + query + APIKEY)
        print(f"{new_row.status_code} - {increment}. {gid}")
        time.sleep(.5)
    except ValueError:
        print(str(increment) + '. ' + str(g[1]) + " - FAILED")

update_geom = f"UPDATE {DATABASEID} SET the_geom = "
update_geom += "ST_SetSRID(st_makepoint(longitude,latitude),4326)"
update_geom = r.get(f"{CARTOURL}{update_geom}{APIKEY}")
if update_geom.status_code == 200:
    update_geom = update_geom.json()
    total_rows = update_geom['total_rows']
    print(f"DATA TRUNCATED {total_rows}")
else:
    print("DATA TRUNCATE FAILED")
    sys.exit(1)
