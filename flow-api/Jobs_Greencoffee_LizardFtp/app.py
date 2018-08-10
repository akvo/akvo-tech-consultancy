import time
from ftplib import FTP
import pandas as pd
import requests
import logging
from collections import OrderedDict
import json

logging.basicConfig(level=logging.WARN)
start_time = time.time()


def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent

################

email = 'xxx'
password = 'xxx'
ftp_user = 'xxx'
ftp_pass = 'xxx'
ftp_addr = 'xxx'

################

instanceURI = 'greencoffee'
surveyID = '19590001'
formID = '10760001'

requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI + '/surveys/' + surveyID
formURI = 'https://api.akvo.org/flow/orgs/' + instanceURI + '/form_instances?survey_id=' + surveyID + '&form_id=' + formID
headers = {'Content-Type': 'application/x-www-form-urlencoded'}
tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
rtData = {
    'client_id':'curl',
    'username': email,
    'password': password,
    'grant_type':'password',
    'scope':'openid offline_access'
}



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



dataPoints = []
apiData = getResponse(requestURI).get('forms')
questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
meta = questions(apiData[0]['questionGroups'])

def getAll(url):
    data = getResponse(url)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        url = data.get('nextPageUrl')
        print(checkTime(time.time()) + ':: GET DATA FROM[' + url +']')
        getAll(url)
    except:
        return "done"
    return

def handleOption(data):
    response=""
    for value in data:
        if(response==""):
            if(value.get("code")==None):
                response=value.get('text',"")
            else :
                response=value.get('code')+":"+value.get('text',"")
        elif(response):
            if(value.get("code")==None):
                response=response+"|"+value.get('text',"")
            else:
                response=response+"|"+value.get('code',"")+":"+value.get('text',"")
    return response

def handleFreeText(data):
    return data


def handleBarCode(data):
    return data

def handleDate(data):
    return data

def handleNumber(data):
    return data

def handleCascade(data):
    response=""
    for value in data:
        if(response==""):
            if(value.get("code")==None):
                response=value.get('name',"")
            else:
                response=value.get('code',"")+":"+value.get("name","")
        elif(response):
            if(value.get("code")==None):
                response=response+"|"+value.get('name',"")
            else:
                response=response+"|"+value.get('code',"")+":"+value.get("name","")

    return response

def handleGeoshape(data):
    return data

def handleGeolocation(final,value,key):
    text=key+"|Latitude"
    if value:
        final[text].append(value.get('lat',''))
        final['--GEOLON--|Longitude'].append(value.get('long',''))
    else:
        final[text].append('')
        final['--GEOLON--|Longitude'].append('')

def handleCaddisfly(data):
    return data

def handlePhotoQuestion(data):
    return data.get('filename',"")

def handleVideoQuestion(data):
    return data.get('filename',"")

def handleSignature(data):
    return data.get('name',"")

def handleQuestion(q):
    qType= q['type']
    value = q['value']
    if (value == 'Error'):
        return ""
    elif(qType=='OPTION'):
        return handleOption(value)
    elif(qType=='PHOTO'):
        return handlePhotoQuestion(value)
    elif(qType=='CADDISFLY'):
        return handleCaddisfly(value)
    elif(qType=='VIDEO'):
        return handleVideoQuestion(value)
    elif(qType=='GEOSHAPE'):
        return handleGeoshape(value)
    elif(qType=='GEO'):
        return handleGeolocation(value)
    elif(qType=='FREE_TEXT'):
        return handleFreeText(value)
    elif(qType=='SCAN'):
        return handleBarCode(value)
    elif(qType=='DATE'):
        return handleDate(value)
    elif(qType=='NUMBER'):
        return handleNumber(value)
    elif(qType=='CASCADE'):
        return handleCascade(value)
    elif(qType=='SIGNATURE'):
        return handleSignature(value)
    else:
        return ""

mt = pd.DataFrame(meta)
getAll(formURI)
print(checkTime(time.time()) + ':: DONE DOWNLOADING')

matched = []
indexer = lambda x:[[b['name'],handleQuestion(b)] for b in x]

for data in dataPoints:
    filtered = dict(OrderedDict(sorted(data.items(), key=lambda data: data[0])))
    try:
        answers = data['responses']
        filtered.pop('responses',None)
        for x, metas in enumerate(list(mt['id'])):
            try:
                answer = data['responses'][metas]
                qsti = pd.DataFrame(mt['questions'][x])
                answ = pd.DataFrame(answer)
                answ = answ.reindex(columns=list(qsti['id']), fill_value='Error')
                value = qsti.apply(lambda x: answ[x['id']], axis=1)
                qsti[['value']] = value
                result = qsti[['name','type','value']]
                final_answer = indexer(result.to_dict('records'))
                for final in final_answer:
                    filtered.update({final[0]:final[1]})
            except:
                pass
        matched.append(filtered)
    except:
        matched.append(filtered)

results = []
for match in matched:
    data_index = []
    for mtg in match:
        data_index.append({mtg:match[mtg]})
    results.append({'response':data_index})
print(checkTime(time.time()) + ':: DONE TRANSFORMING')


filename = 'testing_deden.json'
with open(filename, 'w') as outfile:
    json.dump(results, outfile)

ftp_session = FTP(ftp_addr,ftp_user,ftp_pass)
file_to_upload = open(filename,'rb')
ftp_session.storbinary('STOR /incoming/05_AKVO/'+ filename, file_to_upload)
file_to_upload.close()
ftp_session.quit()

print(checkTime(time.time()) + ':: DONE UPLOADING')
