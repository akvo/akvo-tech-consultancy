from flask import Flask, jsonify, request
from datetime import datetime
from app.config import requestURI, postURI, keymd5, payload, accounts, headers
from app.api import getResponse, getForm, setQuestionAttr, setData
from pytz import utc, timezone
import xmltodict
import requests
import dateutil.parser
import pandas as pd
import logging
from collections import OrderedDict
app = Flask(__name__)
log_file = './error-log.log'
logging.basicConfig(filename=log_file,level=logging.DEBUG)

def filterAnswerbyDate(dt):
    if dt.date() == datetime.today().date():
        return True
    return False

latest_input = []

def filterData(answer, par_id, meta, submitter_id):
    correction = ''
    resp = [
        {'key':'keymd5', 'value':keymd5},
        {'key':'ACC_ID', 'value': submitter_id},
    ]
    for mt in meta:
        try:
            values = answer['responses'][par_id][0][mt['id']]
            if mt['type'] == 'CASCADE':
                resp.append({'key':'ID_Commodity', 'value':values[2]['code']})
                resp.append({'key':'ID_Agency', 'value':values[1]['code']})
                correction = submitter_id + '|' + values[1]['code'] +'|'+ values[2]['code']
            elif mt['type'] == 'DATE':
                date_val = datetime.strptime(values, '%Y-%m-%dT%H:%M:%S.%fZ')
                date_here = utc.localize(date_val).astimezone(timezone('Asia/Singapore'))
                check_date = filterAnswerbyDate(date_here)
                if check_date:
                    new_date = datetime.strftime(date_here,'%Y/%m/%d')
                    resp.append({'key':'Date_var', 'value':new_date})
                else:
                    return False
            else:
                resp.append({'key':mt['variableName'],'value':str(values)})
        except:
            resp.append({'key':mt['variableName'],'value':'0'})
    if correction in latest_input:
        logging.warn('PASS: DUPLICATED VALUE')
        return False
    latest_input.append(correction)
    return resp

def getRawData(survey_id, form_id):
    collections = []
    data = getResponse(requestURI + '/surveys/' + survey_id)
    # submitter ID
    submitter_id = data['name'].split('_')[1]
    acc_detail = None
    for account in accounts:
        if account['id'] == submitter_id:
            acc_detail = account
    meta = data['forms'][0]['questionGroups'][0]['questions']
    for form in data['forms']:
        par_id = form['questionGroups'][0]['id']
        answers = getResponse(requestURI + '/form_instances?survey_id=' + survey_id + '&form_id=' + form_id)
        for answer in answers['formInstances']:
            filteredDate = filterData(answer,par_id, meta, submitter_id)
            if filteredDate:
                login = payload([
                    {'key':'keymd5', 'value':keymd5},
                    {'key':'acc_name', 'value':acc_detail['name']},
                    {'key':'acc_pass', 'value':acc_detail['pass']}
                ])
                url = postURI + '/login_return_ACC_ID'
                u = requests.post(url, data = login, headers = headers)
                uid = xmltodict.parse(u.text)
                ids = uid['short']['#text']
                if ids == '0':
                    log = 'error login'
                    logging.warn(log)
                else:
                    url = postURI + '/add_price_return_newid'
                    r = requests.post(url, data = payload(filteredDate), headers = headers)
                    try:
                        log = xmltodict.parse(r.text)
                        log = 'Success! ' + log['string']['#text']
                        logging.info(log)
                    except xmltodict.expat.ExpatError:
                        log = r.text
                        logging.error(log)
                collections.append({
                    'id': answer['id'],
                    'submitter':answer['submitter'],
                    'identifier':answer['identifier'],
                    'device':answer['deviceIdentifier'],
                    'submited_at':answer['submissionDate'],
                    'login':acc_detail,
                    'payload':payload(filteredDate),
                })
    return collections

@app.route('/greencoffee')
def updateAll():
    data = getResponse(requestURI + '/surveys?folder_id=38000001')
    lists = []
    for dt in data['surveys']:
        sid = getResponse(requestURI + '/surveys/' + dt['id'])
        responses = getRawData(dt['id'], sid['forms'][0]['id'])
        if responses is not None:
            for resp in responses:
                lists.append(resp)
    return jsonify(lists)


### Pragmatic / Manual Trigger

@app.route('/folders')
def getFolder():
    data = getResponse(requestURI + '/folders')
    data = data['folders']
    lists = []
    for dt in data:
        list = {
            'name':dt['name'],
            'link': request.host_url + 'folder/' + dt['id']
        }
        lists.append(list)
    return jsonify(lists)

@app.route('/folder/<id>')
def getSurveys(id):
    data = getResponse(requestURI + '/surveys?folder_id=' + id)
    lists = []
    for dt in data['surveys']:
        list = {
            'name':dt['name'],
            'link': request.host_url + 'survey/' + dt['id'],
            'created_at': dateutil.parser.parse(dt['createdAt']),
            'modified_at': dateutil.parser.parse(dt['modifiedAt'])
        }
        lists.append(list)
    return jsonify(lists)


@app.route('/survey/<id>')
def getSurvey(id):
    data = getResponse(requestURI + '/surveys/' + id)
    data['meta_url'] = request.host_url + 'datapoint/' + data['id']
    collections = []
    for form in data['forms']:
        collection_links = {
                'path': request.host_url + 'collections/' + data['id'] + '/' + form['id'],
                'name': form['name'],
                'questionnaire': form['questionGroups']
        }
        collections.append(collection_links)
    data['forms'] = collections
    return jsonify(data)

@app.route('/datapoint/<id>')
def getDataPoint(id):
    data = getResponse(requestURI + '/data_points?survey_id=' + id)
    return jsonify(data)

@app.route('/collections/<survey_id>/<form_id>')
def getData(survey_id, form_id):
    lists = []
    sid = getResponse(requestURI + '/surveys/' + survey_id)
    responses = getRawData(survey_id, sid['forms'][0]['id'])
    if responses is not None:
        for resp in responses:
            lists.append(resp)
    return jsonify(lists)

@app.route('/input-list/<survey_id>/<form_id>')
def inputList(survey_id, form_id):
    collections = []
    data = getResponse(requestURI + '/surveys/' + survey_id)
    data['meta_url'] = request.host_url + 'datapoint/' + data['id']
    # submitter ID
    submitter_id = data['name'].split('_')[1]
    meta = data['forms'][0]['questionGroups'][0]['questions']
    for form in data['forms']:
        par_id = form['questionGroups'][0]['id']
        answers = getResponse(requestURI + '/form_instances?survey_id=' + survey_id + '&form_id=' + form_id)
        for answer in answers['formInstances']:
            resp = []
            for x, mt in enumerate(meta):
                try:
                    values = answer['responses'][par_id][0][mt['id']]
                    if mt['type'] == 'CASCADE':
                        apps = {
                            ''
                        }
                    apps = {
                        'val' : values,
                        'type' : mt['type'],
                        'var' : mt['variableName']
                    }
                    resp.append(apps)
                except:
                    resp.append({
                        'val' : 0,
                        'type' : mt['type'],
                        'var' : mt['variableName']
                    })
            collections.append({
                'id': answer['id'],
                'submitter':answer['submitter'],
                'submitter_id': submitter_id,
                'identifier':answer['identifier'],
                'device':answer['deviceIdentifier'],
                'submited_at':answer['submissionDate'],
                'responses':resp,
            })
    return jsonify(collections)

@app.route('/download/<id>')
def downloadData(id):
    url = requestURI + '/surveys/' + id
    allData = []
    for path, url in OrderedDict().items():
        surveys = getResponse(url)
        return jsonify(surveys)
        if (surveys.get('forms')):
            finalData = []
            for survey in surveys['forms']:
                form = survey.get('name', 'No Name')[0:2] + '_' + survey.get('id') + '.csv'
                form = form.replace('/', '_')
                formInstances = getForm(survey)
                qMap = OrderedDict()
                finalData = OrderedDict()
                setQuestionAttr(survey, qMap, finalData)
                setData(formInstances, qMap, finalData)
                df = pd.DataFrame(finalData, columns=finalData.keys)
                allData.append(df)
            return jsonify(allData)
        else:
            'No surveys found'

@app.route('/addprice')
def login():
    url = postURI + '/login_return_ACC_ID'
    data = payload([
        {'key':'keymd5', 'value':keymd5},
        {'key':'acc_name', 'value':'trang123'},
        {'key':'acc_pass', 'value':'1234'},
    ])
    u = requests.post(url, data = data, headers = headers)
    uid = xmltodict.parse(u.text)
    ids = uid['short']['#text']
    if ids == '0':
        response = 'error login'
    else:
        url = postURI + '/add_price_return_newid'
        values = payload([
            {'key':'keymd5', 'value':keymd5},
            {'key':'ID_Commodity', 'value':'1'},
            {'key':'ID_Agency', 'value':'1'},
            {'key':'Date_var', 'value':'06/05/2018'},
            {'key':'MIN_PRICE', 'value':'999'},
            {'key':'MAX_price', 'value':'888'},
            {'key':'ACC_ID', 'value': '9'},
        ])
        r = requests.post(url, data = values, headers = headers)
        response = r.text
    return response


if __name__=='__main__':
    app.config.update(DEBUG=True)
    app.run()
