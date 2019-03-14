import json
import requests
import pandas as pd
import logging
import os

pd.set_option("display.max_columns",100)

URL = 'https://watershed.akvoapp.org/rest/v1/'
API_KEY = os.environ['RSR_APIKEY']

PROJECT_ID = '3968'
FMT = '/?format=json'
FMT100 = '/?format=json&limit=100'
headers = {
    'content-type': 'application/json',
    'Authorization': 'Token {}'.format(API_KEY)
}


def getRsrResponse(uri):
    api = ''.join(str(x) for x in uri)
    logging.warning(api)
    resp = requests.get(api, headers=headers)
    return resp

def postRsr(uri, data):
    api = ''.join(str(x) for x in uri)
    resp = requests.post(api, data=json.dumps(data), headers=headers)
    return resp.json()

def getProjectTitle(ids):
    uri = [URL + 'project/',ids, FMT]
    data = getRsrResponse(uri)
    return data.json().get('title')

def relatedProject():
    uri = [URL + 'related_project',FMT + '&related_project=',PROJECT_ID]
    data = getRsrResponse(uri)
    return data.json().get('results')

def projectUpdate(ids):
    uri = [URL + 'project_update',FMT + '&project=', ids]
    data = getRsrResponse(uri)
    return data.json().get('results')

def getUser(ids):
    uri = [URL + 'user', FMT + '&limit=1&id=', ids]
    data = getRsrResponse(uri)
    return data.json().get('results')

related_project = relatedProject()
getRelatedProjectID = lambda x: [y['project'] for y in x]
project_id = getRelatedProjectID(related_project)
updates = []

for pids in project_id:
    update = projectUpdate(pids)
    project = {'project_name' : getProjectTitle(pids)}
    for upd in update:
        upd.update(project)
        updates.append(upd)

data = pd.DataFrame(updates)
users = data.user.unique().tolist()
user_details = []

for user in users:
    user_details.append(getUser(user)[0])

users = pd.DataFrame(user_details)
users['name'] = users['first_name'] + ' ' + users['last_name']
users = users[['id','email','name']]
users['name'] = users['name'].apply(lambda x:x.title())
users = users.rename(columns={'id':'user'})

merged = pd.merge(data, users, on='user')
merged = merged.drop(columns=['deletable','editable','edited'],axis=1)

merged['absolute_url'] = merged['absolute_url'].apply(lambda x: 'https://watershed.akvoapp.org'+x)
merged['photo'] = merged['photo'].apply(lambda x: None if x == None else 'https://watershed.akvoapp.org' + x)
merged['locations_id'] = merged['locations'].apply(lambda x: None if x == [] else x[0]['id'])
merged['locations'] = merged['locations'].apply(lambda x: None if x == [] else [x[0]['latitude'],x[0]['longitude']])

merged = merged[['project_name',
                'event_date',
                'id',
                'project',
                'locations_id',
                'locations',
                'created_at',
                'last_modified_at',
                'title',
                'name',
                'email',
                'language',
                'update_method',
                'text',
                'primary_location',
                'notes',
                'photo',
                'photo_caption',
                'photo_credit',
                'video',
                'video_caption',
                'video_credit',
                'absolute_url']]

column_name = {}
for cname in list(merged):
    column_name.update({cname:cname.replace('_',' ').title()})
merged = merged.rename(columns = column_name)

merged.to_excel('./water-sheed_related-project-update.xlsx', index=None)

