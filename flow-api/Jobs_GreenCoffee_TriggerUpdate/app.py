import os
from datetime import datetime
from pytz import utc, timezone
import pandas as pd
import xmltodict
import requests
import logging

logging.basicConfig(level=logging.WARN)
results = {}
date_mark = []
payload = []
posts = []

tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
instanceURI = 'greencoffee'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI

keymd5 = 'c946415addc376cc50c91956a51823f1'
postURI = 'http://118.70.171.49:64977/WebService.asmx'

rtData = {
    'client_id':'curl',
    "username": os.environ["KEYCLOAK_USER"],
    "password": os.environ["KEYCLOAK_PWD"],
    'grant_type':'password',
    'scope':'openid offline_access'
}

headers = {'Content-Type': 'application/x-www-form-urlencoded'}


def refreshData():
    tokens = requests.post(tokenURI, rtData).json();
    return tokens['refresh_token']

def getAccessToken():
    account = {
        'client_id':'curl',
        'refresh_token': refreshData(),
        'grant_type':'refresh_token'
    }
    try:
        account = requests.post(tokenURI, account).json();
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
    response = requests.get(url, headers=header).json()
    return response

def logTime(error_code):
    now = datetime.now()
    now = '[' + now.strftime('%d/%b/%Y %H:%M:%S')  + '] ' + error_code + ':'
    return now

def post_data(keyval):
    url = postURI + '/add_price_return_newid'
    date = datetime.strptime(keyval['date'], '%Y-%m-%d %H:%M:%S')
    date = datetime.strftime(date, '%Y/%m/%d')
    uid = '&ACC_ID=' + keyval['uid']
    date = '&Date_var=' + date.replace('/','%2F') + uid
    agency = '&ID_Agency=' + keyval['agency'] + date
    comm = '&ID_Commodity=' + keyval['commodity'] + agency
    mval = '&MIN_PRICE=' + str(int(keyval['value'])) + comm + '&MAX_PRICE=0'
    post = 'keymd5=' + keymd5 + mval
    r = requests.post(url, data = post, headers = headers)
    try:
        log = xmltodict.parse(r.text)
        return_id = log['string']['#text']
        log = logTime('SUCCESS') + 'INPUT ID:' + return_id
        print(log)
    except xmltodict.expat.ExpatError:
        log = logTime('ERROR') + r.text
        print(log)
    return keyval

def get_data(survey_url):
    mt = getResponse(survey_url)
    meta = pd.DataFrame(mt['forms'][0]['questionGroups'][0]['questions'])
    name = mt['forms'][0]['questionGroups']
    form = mt['forms'][0]['formInstancesUrl']
    submitter_id = mt['name'].split('_')[1]
    submitter_name = mt['name'].split('_')[0]
    meta_id = name[0]['id']
    sources = getResponse(form).get('formInstances')
    data = [d['responses'] for d in sources if 'responses' in d]
    data = [d[meta_id][0] for d in data if meta_id in d]
    submit_date = [d['submissionDate'] for d in sources if 'submissionDate' in d]
    appending(meta,data,submitter_id,submit_date,submitter_name)
    return True

def appending(meta,data,submitter_id,submit_date,submitter_name):
    for idt, dt in enumerate(data):
        d_ori = datetime.strptime(submit_date[idt], '%Y-%m-%dT%H:%M:%SZ')
        d_here = utc.localize(d_ori).astimezone(timezone('Asia/Singapore'))
        if d_here.date() == datetime.today().date():
            unique = datetime.strftime(d_ori, '%Y-%m-%d')
            d_val = datetime.strftime(d_here, '%Y-%m-%d %H:%M:%S')
            values = {'date':d_val}
            values.update({'sid':submitter_id})
            for idx, row in meta.iterrows():
                if row['variableName'] == 'detail':
                    code = dt[row['id']][0]['code'] + '_' + dt[row['id']][1]['code']
                    values.update({'code':code})
                    unique = unique + 'U' + submitter_id + 'A_' + code
                else:
                    values.update({row['variableName']:dt[row['id']]})
            code = values['code'].split('_')
            try:
                latest = datetime.strptime(results[unique][0]['date'],'%Y-%m-%d %H:%M:%S')
                newest = datetime.strptime(d_val,'%Y-%m-%d %H:%M:%S')
                print(logTime('WARNING') + submitter_name.upper() + ' HAS DUPLICATED VALUE!')
                if latest < newest:
                    add_results(unique,values,code, False)
                    print(logTime('INFO') + 'REPLACED WITH NEW VALUE!')
                else:
                    print(logTime('INFO') + 'PASS VALUE!')
                    pass
            except:
                add_results(unique,values,code, True)
                print(logTime('INFO') + submitter_name.upper() + ' HAS ADDED NEW PRICE!')
                print(logTime('INFO') + 'ADDED NEW VALUE!')
        else:
            pass
    return True

def add_results(unique, values, code, mark):
    agency = code[0]
    comm = code[1].split('-')
    results.update({unique:[
        {'uid':values['sid'],'date':values['date'],'agency':agency,'commodity':comm[0],'value':values['ap']},
        {'uid':values['sid'],'date':values['date'],'agency':agency,'commodity':comm[1],'value':values['cp']}
    ]})
    if mark == True:
        date_mark.append(unique)
    return True


def execute(folder_id):
    urls = getResponse(requestURI + '/surveys?folder_id=' + folder_id).get('surveys')
    urls = [a['surveyUrl'] for a in urls if 'surveyUrl' in a]
    for url in urls:
        try:
            get_data(url)
        except:
            pass
    return True

print('\n--- CRON JOB IS START ---\n')

execute('30240002')
print('\n--- BULK POST STARTING ---\n')
for dm in date_mark:
    for res in results[dm]:
        payload.append(res)
for pld in payload:
        posts.append(post_data(pld))

from tabulate import tabulate
tb = pd.DataFrame(payload)
tb = tb[['date','uid','agency','commodity','value']]
tb = tb.to_dict(orient='list')


print('\n--- DONE UPDATING ---\n')

print(tabulate(tb, headers='keys', tablefmt='fancy_grid'))

print('\n--- CRON JOB FINISHED ---\n')
