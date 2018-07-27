from datetime import datetime
from app.config import requestURI, postURI, keymd5, headers
from app.api import getResponse
from pytz import utc, timezone
import xmltodict
import requests
import logging

### Logging

logging.basicConfig(level=logging.WARN)

### Daily Job

def filterAnswerbyDate(dt):
    if dt.date() == datetime.today().date():
        return True
    return False

def payload(keyval):
    strres = ''
    for i, dt in enumerate(keyval):
        if i == 0:
            strres = dt['key'] + '=' + dt['value']
        else:
            if dt['key'] == 'Date_var':
                date_conv = dt['value'].replace('/','%2F')
                strres = strres + '&' + dt['key'] + '=' + date_conv
            else:
                strres = strres + '&' + dt['key'] + '=' + dt['value']
    return strres

latest_input = []
current_data = []
latest_value = {}
filtered_data = []

def postData(filteredData):
    url = postURI + '/add_price_return_newid'
    r = requests.post(url, data = filteredData, headers = headers)
    try:
        now = datetime.now()
        now = now.strftime('%d/%b/%Y %H:%M:%S')
        log = xmltodict.parse(r.text)
        return_id = log['string']['#text']
        log = 'SUCCESS [' + now + '] - INPUT ID:' + return_id
        print(log)
    except xmltodict.expat.ExpatError:
        log = r.text
        logging.error(log)
    filtered_data.append({
        'payload': filteredData.split('&'),
        'return_id': return_id
    })
    return True

def filterData(answer, par_id, meta, submitter_id):
    correction = []
    resp = [
        {'key':'keymd5', 'value':keymd5},
        {'key':'ACC_ID', 'value': submitter_id},
    ]
    subDate = answer['submissionDate']
    date_val = datetime.strptime(subDate, '%Y-%m-%dT%H:%M:%SZ')
    date_here = utc.localize(date_val).astimezone(timezone('Asia/Singapore'))
    check_date = filterAnswerbyDate(date_here)
    if check_date:
        new_date = datetime.strftime(date_here,'%Y/%m/%d')
        resp.append({'key':'Date_var', 'value':str(new_date)})
        correction.append(str(new_date))
    else:
        return False
    for mt in meta:
        try:
            values = answer['responses'][par_id][0][mt['id']]
            if mt['type'] == 'CASCADE':
                resp.append({'key':'ID_Commodity', 'value':values[2]['code']})
                resp.append({'key':'ID_Agency', 'value':values[1]['code']})
                correction.append(values[2]['code'])
                correction.append(values[1]['code'])
            elif mt['type'] == 'DATE':
                pass
            else:
                resp.append({'key':mt['variableName'],'value':str(values)})
        except:
            resp.append({'key':mt['variableName'],'value':'0'})
    corr = " ".join(str(x) for x in correction)
    if corr in latest_input:
        logging.warn('PASS: DUPLICATED VALUE')
        odate = datetime.strptime(latest_value[corr]['date'],'%Y-%m-%d %H:%M:%S')
        if date_val > odate:
            print('GETTING THE LATEST VALUE')
            latest_value[corr] = {'payload':payload(resp), 'date':str(date_val)}
            return True
        return False
    latest_input.append(corr)
    latest_value.update({corr:{'payload':payload(resp), 'date':str(date_val)}})
    return True

def getRawData(survey_id, form_id):
    data = getResponse(requestURI + '/surveys/' + survey_id)
    # submitter ID
    submitter_id = data['name'].split('_')[1]
    meta = data['forms'][0]['questionGroups'][0]['questions']
    for form in data['forms']:
        par_id = form['questionGroups'][0]['id']
        answers = getResponse(requestURI + '/form_instances?survey_id=' + survey_id + '&form_id=' + form_id)
        for answer in answers['formInstances']:
            try:
                filterData(answer, par_id, meta, submitter_id)
            except:
                pass
    return

def updateAll():
    data = getResponse(requestURI + '/surveys?folder_id=38000001')
    for dt in data['surveys']:
        sid = getResponse(requestURI + '/surveys/' + dt['id'])
        getRawData(dt['id'], sid['forms'][0]['id'])
    for corr in latest_input:
        postData(latest_value[corr]['payload'])
    now = datetime.now()
    now = now.strftime('%d/%b/%Y %H:%M:%S')
    if not latest_input:
        logging.warn(" ["+ now + "] DATA NOT FOUND")
    else:
        print('\n--- DATA SENT ---\n')
    print('\n--- CRON JOB FINISHED ---')


print('\n--- CRON JOB IS STARTED ---\n')
updateAll()
