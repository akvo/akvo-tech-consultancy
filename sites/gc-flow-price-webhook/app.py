from datetime import datetime
from pytz import utc, timezone
from lxml import etree as et
from Akvo import Flow
import pandas as pd
import xmltodict
import requests as r
import logging
from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app, async_mode='threading', path='/gc-flow-price-webhook')
global runjob
runjob = "inactive"


logging.basicConfig(level=logging.WARN)
user_ids = ['230','236','233','222','238','228','235','217','234','11','226','231','237','239','10']
cdate = datetime.strftime(datetime.today().date(), '%Y-%m-%d')

tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
instanceURI = 'greencoffee'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
folderID = '30240002'

### PARAMS PRODUCTION
website = 'http://giacaphe.ipsard.gov.vn/WebService.asmx'
keymd5 = '?keymd5=c946415addc376cc50c91956a51823f1&'
dateFormat = '%Y-%m-%dT%H:%M:%S'
checkURI = website +'/select_price_by_date_and_ACC_ID'  + keymd5
headers = {'Content-Type': 'application/x-www-form-urlencoded'}

### SocketIO

def bthread(data):
    emit('response', {'data':data}, namespace='/gc-flow-price-webhook/status', broadcast=True)
    socketio.sleep(0)

@socketio.on('connect', namespace='/gc-flow-price-webhook/status')
def connect():
    emit('response', {'data':runjob}, namespace='/gc-flow-price-webhook/status', broadcast=True)
    socketio.sleep(0)

### UPDATER

def logTime(error_code):
    now = datetime.now()
    now = '[' + now.strftime('%d/%b/%Y %H:%M:%S')  + '] ' + error_code + ':'
    return now

def post_data(keyval):
    date = datetime.strptime(keyval['date'], '%Y-%m-%d %H:%M:%S')
    date = datetime.strftime(date, '%Y/%m/%d')
    uid = '&ACC_ID=' + keyval['uid']
    date = '&Date_var=' + date.replace('/','%2F') + uid
    agency = '&ID_Agency=' + keyval['agency'] + date
    comm = '&ID_Commodity=' + keyval['commodity'] + agency
    mval = '&MIN_PRICE=' + str(int(keyval['value'])) + comm + '&MAX_PRICE=0'
    post_new_price = False
    try:
        mval = mval + '&ID_PRICE=' + keyval['price_id']
        url = website + '/update_price'
        post_new_price = True
    except:
        url = website + '/add_price_return_newid'
    post = keymd5.replace('?','') + mval
    req = r.post(url, data = post, headers = headers)
    try:
        log = xmltodict.parse(req.text)
        return_id = log['string']['#text']
        if post_new_price == True:
            log = logTime('SUCCESS') + 'INPUT ID:' + keyval['price_id'] + ' - ' + return_id.upper()
        else:
            log = logTime('SUCCESS') + 'INPUT ID:' + return_id + ' - NEW RECORD'
        print(log)
        bthread(log)
    except xmltodict.expat.ExpatError:
        log = logTime('ERROR') + req.text
        print(log)
        bthread(log)
    return keyval

def push_data(datapoints_url, submitter_id, submitter_name, meta, meta_id):
    src = Flow.getResponse(datapoints_url)
    sources = src.get('formInstances')
    if len(sources) > 0:
        data = [d['responses'] for d in sources if 'responses' in d]
        data = [d[meta_id][0] for d in data if meta_id in d]
        submit_date = [d['submissionDate'] for d in sources if 'submissionDate' in d]
        appending(meta,data,submitter_id,submit_date,submitter_name)
        try:
            next_page = src.get('nextPageUrl')
            push_data(next_page, submitter_id, submitter_name, meta, meta_id)
        except:
            pass
    return True

def get_data(survey_url):
    mt = Flow.getResponse(survey_url)
    meta = pd.DataFrame(mt['forms'][0]['questionGroups'][0]['questions'])
    name = mt['forms'][0]['questionGroups']
    form = mt['forms'][0]['formInstancesUrl']
    submitter_id = mt['name'].split('_')[1]
    submitter_name = mt['name'].split('_')[0]
    meta_id = name[0]['id']
    try:
        push_data(form, submitter_id, submitter_name, meta, meta_id)
    except:
        pass
    return True

def appending(meta,data,submitter_id,submit_date,submitter_name):
    for idt, dt in enumerate(data):
        d_ori = datetime.strptime(submit_date[idt], '%Y-%m-%dT%H:%M:%SZ')
        d_here = utc.localize(d_ori).astimezone(timezone('Asia/Singapore'))
        today_date = datetime.today().date()
        if d_here.date() == today_date:
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
                print(logTime('WARNING') + submitter_name.upper() + ' REPLACED PRICE!')
                bthread(logTime('WARNING') + submitter_name.upper() + ' REPLACED PRICE!')
                if latest < newest:
                    add_results(unique,values,code, submitter_id, False)
                    print(logTime('INFO') + 'REPLACED WITH NEW VALUE!')
                    bthread(logTime('INFO') + 'REPLACED WITH NEW VALUE!')
                else:
                    print(logTime('INFO') + 'PASS VALUE!')
                    bthread(logTime('INFO') + 'PASS VALUE!')
                    pass
            except:
                add_results(unique,values,code, submitter_id, True)
                print(logTime('INFO') + submitter_name.upper() + ' SENT NEW PRICE!')
                bthread(logTime('INFO') + submitter_name.upper() + ' SENT NEW PRICE!')
                print(logTime('INFO') + 'ADDED NEW VALUE!')
        else:
            pass
    return True

def add_results(unique, values, code, submitter_id, mark):
    agency = code[0]
    if int(submitter_id) == 10:
        results.update({unique:[
            {'uid':values['sid'],'date':values['date'],'agency':agency,'commodity':code[1],'value':values['pc']},
        ]})
    else:
        comm = code[1].split('-')
        results.update({unique:[
            {'uid':values['sid'],'date':values['date'],'agency':agency,'commodity':comm[0],'value':values['ap']},
            {'uid':values['sid'],'date':values['date'],'agency':agency,'commodity':comm[1],'value':values['cp']}
        ]})
    if mark == True:
        date_mark.append(unique)
    return True


def execute(folder_id):
    urls = Flow.getResponse(requestURI + '/surveys?folder_id=' + folder_id).get('surveys')
    urls = [a['surveyUrl'] for a in urls if 'surveyUrl' in a]
    for url in urls:
        try:
            get_data(url)
        except:
            pass
    return True

def getOldData(user_id):
    personalURI = checkURI+'date_var='+cdate+'&ACC_ID='+user_id
    data = et.parse(personalURI)
    root = data.getroot()
    a = et.fromstring(root.text.replace('\n',''))
    b = a.xpath('/NewDataSet/PRICE')
    if len(b)>0:
        for g in b:
            existing = {'price_id':g[0].text,
                        'value':g[4].text,
                        'commodity':g[1].text,
                        'agency':g[2].text,
                        'date':g[3].text.replace('+07:00','').replace('T',' ')}
            data_update.append(existing)
    else:
        pass
    return True

def fillFloat(batch):
    if type(batch['date']) is float:
            batch['date'] = cdate
            del batch['price_id']
    else:
        pass
    return batch

def checkAvailable(payload):
    new_input = pd.DataFrame(payload)
    old_input = pd.DataFrame(data_update)
    new_input['agent_commodity'] = new_input[['agency','commodity']].apply(lambda x:x[0]+'_'+x[1], axis=1)
    old_input['agent_commodity'] = old_input[['agency','commodity']].apply(lambda x:x[0]+'_'+x[1], axis=1)
    merged_input = pd.merge(old_input, new_input, how='right', on=['agent_commodity', 'agent_commodity'])
    merged_input = merged_input.drop(['agency_x','commodity_x','value_x','date_x','agent_commodity'],axis=1)
    merged_input = merged_input.dropna(subset=['value_y','agency_y','commodity_y'])
    merged_input = merged_input.rename(columns={
        'agency_y':'agency',
        'commodity_y':'commodity',
        'date_y':'date',
        'value_y':'value'
    })
    print(logTime('INFO') + ' ' + str(len(payload)) + ' AKVO FLOW RECORDS')
    bthread(logTime('INFO') + ' ' + str(len(payload)) + ' AKVO FLOW RECORDS')
    print(logTime('INFO') + ' ' + str(len(old_input)) + ' IPSARD RECORDS')
    bthread(logTime('INFO') + ' ' + str(len(old_input)) + ' IPSARD RECORDS')
    print(logTime('INFO') + ' ' + str(len(merged_input.to_dict('records'))) + ' MERGED RECORDS')
    bthread(logTime('INFO') + ' ' + str(len(merged_input.to_dict('records'))) + ' MERGED RECORDS')
    new_batch = merged_input.to_dict('records')
    for batch in new_batch:
        fillFloat(batch)
    return new_batch

def startUpdate():
    global results
    global date_mark
    global payload
    global posts
    global data_update
    global runjob
    runjob = "active"
    results = {}
    date_mark = []
    payload = []
    posts = []
    data_update = []
    print('\n--- CRON JOB IS STARTED ---\n')
    bthread('--- CRON JOB IS STARTED ---')
    for user_id in user_ids:
        getOldData(user_id)
    execute('30240002')
    try:
        print('\n--- BULK POST STARTING ---\n')
        bthread('\n--- BULK POST STARTING ---\n')
        for dm in date_mark:
            for res in results[dm]:
                payload.append(res)
        if len(data_update) > 0:
            print(logTime('INFO') + ' COLLECTING LATEST PRICE!')
            bthread(logTime('INFO') + ' COLLECTING LATEST PRICE!')
            payload = checkAvailable(payload)
        else:
            print(logTime('INFO') + ' COLLECTING FIRST PRICE!')
            bthread(logTime('INFO') + ' COLLECTING FIRST PRICE!')
        for pld in payload:
            posts.append(post_data(pld))
        print('\n--- DONE UPDATING ---\n')
        bthread('\n--- DONE UPDATING ---\n')
    except:
        print('\n--- DATA NOT FOUND ---\n')
        bthread('\n--- DATA NOT FOUND ---\n')
    print('\n--- CRON JOB FINISHED ---\n')
    runjob = "inactive"
    bthread('\n--- CRON JOB FINISHED ---\n')
    bthread(runjob)
    return True

@app.route('/')
def main():
    return render_template('app.html',data = {"job":runjob}, sync_mode=socketio.async_mode)

@app.route('/update')
def update():
    startUpdate()
    return jsonify({'response':'success'})

if __name__ == '__main__':
    app.config.update(DEBUG=True)
    socketio.run(app, host='0.0.0.0', port=3000, debug=True)
