#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
import requests
import json
import uuid
from datetime import datetime
from zipfile import ZipFile, ZIP_DEFLATED
import os
import string
import random
import requests as r
import math
import time
from mailjet_rest import Client
import base64


# In[2]:


EMAIL_RECEPIENTS = ['akvo.tech.consultancy@gmail.com']
EMAIL_BCC = ['galih@akvo.org', 'deden@akvo.org', 'joy@akvo.org']
#EMAIL_RECEPIENTS = ['wgprtm@gmail.com']
#EMAIL_BCC = ['galih@akvo.org']


receiver = []
for email in EMAIL_RECEPIENTS:
    receiver.append({"Email": email})

bcc = []
for email in EMAIL_BCC:
    bcc.append({"Email": email})


# In[3]:


MAILJET_APIKEY = os.environ['MAILJET_API_KEY']
MAILJET_SECRET = os.environ['MAILJET_SECRET']

mailjet = Client(auth=(MAILJET_SECRET, MAILJET_APIKEY), version='v3.1')


# In[4]:


def send_email(filename, files):
    path = "./"
    attach = []
    for f in files:
        with open(path + f, "rb") as fil,  open(path + f + ".b64", 'wb') as fout:
            base64.encode(fil, fout)

        with open(f + ".b64", 'r') as fout:
            attach.append({
                "ContentType": "text/csv",
                "Filename": f,
                "Base64Content": fout.read().rstrip("\n")
            })
        
    email = {
        'Messages': [{
                    "From": {"Email": "noreply@akvo.org", "Name": "noreply@akvo.org"},
                    "To": receiver,
                    "Bcc": bcc,
                    "Subject": 'Akvo TC Flow Datapusher',
                    "TextPart": "Attachment of {}".format(filename),
                    "Attachments": attach
        }]
    }
    
    result = mailjet.send.create(data=email)
    
    for f in files:
        os.remove(path + f + ".b64")
        
    return result


# In[5]:


formId = 301370001
dashboard = "spiceup"
filename = "DATA_CLEANING-301370001.xlsx"
flowAPI = "http://tech-consultancy.akvo.org/akvo-flow-web-api/{}/{}/fetch".format(dashboard, formId)
df = pd.read_excel(filename)


# In[6]:


q = requests.get(flowAPI).json()


# In[7]:


datapointName = []
questions = {}
for x in q['questionGroup']['question']:
    if x['localeNameFlag'] == True:
        datapointName.append({
            'id':'{}|{}'.format(x['id'], x['text']),
            'type': x['type']
        })
        
    objName = '{}|{}'.format(x['id'], x['text'])
    objType = x['type']
    try: 
        objType = x['validationRule']['validationType']
    except:
        pass
    
    questions.update({objName : objType})


# In[8]:


df['uuid'] = df.apply(lambda x: str(uuid.uuid4()), axis=1)


# In[9]:


# Export File with UUID
#export_filename = 'Testing.csv'
export_filename = os.environ['TRAVIS_COMMIT'] + '.csv'

df.to_csv(export_filename)


# In[10]:


def createMetaname(x):
    name = ""
    for i, item in enumerate(datapointName):
        value = str(x[item['id']])
        if item['type'] == 'cascade':
            value = value.replace('|', ' - ')
            
        if i != 0:
            name += " - " + value
        else:
            name = value
        
    return name


# In[11]:


df['meta_name'] = df.apply(createMetaname, axis=1)


# In[12]:


df = df.fillna('###')


# In[13]:


def handler(x):
    responses = [{
        "answerType": "META_NAME",
        "iteration": 0,
        "questionId": "-1",
        "value": x['meta_name']
    }]
    
    for b in questions:
        value = str(x[b])
        if questions[b] == 'option':
            value = json.dumps([{'text':x[b]}])
        if questions[b] == 'cascade':
            value = []
            for v in x[b].split('|'):
                value.append({'name':v})
            value = json.dumps(value)
        if questions[b] == 'date' and x[b] != '###':
            value = x[b]
            try:
                if ' ' in str(value):
                    value = str(value).split(' ')[0]
                if '-' in value:
                    value =  value[:7] + '-' + value[7:]
                    value = value.replace('--', '-')
                    value = value.replace(';', '-')
                if value.count('-') == 3:
                    value = value[0 : 6 : ] + value[6 + 1 : :]
                
                obj_date = datetime.strptime(str(value), '%Y-%m-%d')
                value = round(datetime.timestamp(obj_date) * 1000)
            except:
                #print(value)
                if not math.isnan(value):
                    value = round(int(value) * 10000000)
                else:
                    value = None
                    
        if x[b] == "###":
            value = None
        
        answerType = questions[b].upper()
        if answerType == 'FREE' or answerType == 'NUMERIC':
            answerType = 'VALUE'   
        responses.append({
            "answerType": answerType,
            "iteration": 0,
            "questionId": b.split('|')[0],
            "value": value
        })
        
    return {'responses': responses, 'uuid': x['uuid']}


# In[14]:


df = df.apply(handler, axis=1)


# In[15]:


def id_generator(size=6, chars=string.ascii_lowercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


# In[16]:


payloads = []
for data in list(df):
    payloads.append({
        "dataPointId": "{}-{}-{}".format(id_generator(4), id_generator(4), id_generator(4)),
        "deviceId": "Akvo TC",
        "duration": 0,
        "formId": q['surveyId'],
        "formVersion": q['version'],
        "responses": data['responses'],
        "submissionDate": round(datetime.now().timestamp() * 1000),
        "username": "datapusher",
        "uuid": data['uuid'] 
    })


# In[17]:


err_log = []
suc_log = []
def log_err(results, _uuid):
    if results.status_code != 200 and _uuid not in err_log:
        err_log.append(_uuid)
    
    if results.status_code == 200 and _uuid not in suc_log:
        suc_log.append(_uuid)


# In[18]:


def send_zip(payload, _uuid, instance_id, dashboard, imagelist=[]):
    with open('data.json', 'w') as f:
        json.dump(payload, f)
    zip_name = _uuid + '.zip'
    zip_file = ZipFile(zip_name, 'w')
    zip_file.write('data.json', compress_type=ZIP_DEFLATED)
    zip_file.close()
    os.rename(zip_name, zip_name)
    combined = "all-{}.zip".format(_uuid)
    with ZipFile(combined, 'w') as all_zip:
        all_zip.write(zip_name)
        for image in imagelist:
            if os.path.isfile('./tmp/images/' + image):
                os.rename('./tmp/images/' + image, image)
                all_zip.write(image)
                os.remove(image)

    file_size = os.path.getsize(combined)
    params = {
        'resumableChunkNumber': 1,
        'resumableChunkSize': file_size,
        'resumableCurrentChunkSize': file_size,
        'resumableTotalSize': file_size,
        'resumableType': 'application/zip',
        'resumableIdentifier': _uuid,
        'resumableFilename': combined,
        'resumableRelativePath': combined,
        'resumableTotalChunks': 1
    }
    files = {
        'file': (combined, open(combined, 'rb'), 'application/zip')
    }
    result = r.post(BASE_URL, files=files, data=params)
    log_err(result, _uuid)
    time.sleep(0.5)
    bucket = instance_id + '.s3.amazonaws.com'
    params = {
        'uniqueIdentifier': _uuid,
        'filename': combined,
        'baseURL': dashboard,
        'appId': instance_id,
        'uploadDomain': bucket,
        'complete': 'true'
    }
    result = r.post(BASE_URL, data=params)
    log_err(result, _uuid)
    if not os.path.exists('./tmp'):
        os.mkdir('./tmp')
    if os.path.isfile('data.json'):
        os.remove('data.json')
    if os.path.isfile(zip_name):
        os.remove(zip_name)
    if os.path.isfile(combined):
        os.remove(combined)
        #os.rename(combined, './tmp/ ' + combined)
    return result


# In[19]:


FLOW_SERVICE_URL = "https://flow-services.akvotest.org"
BASE_URL = "{}/upload".format(FLOW_SERVICE_URL)
instance_id = q['app']


# In[20]:


#payloads = payloads[:2]
for payload in payloads:
    results = send_zip(payload, payload['uuid'], instance_id, dashboard)


# In[21]:


error = pd.DataFrame(err_log, columns=['uuid'])
success = pd.DataFrame(suc_log, columns=['uuid'])

er = 'error_log.csv'
sc = 'success_log.csv'
error.to_csv(er)
success.to_csv(sc)
log_files = []
log_files.append(export_filename)
log_files.append(er)
log_files.append(sc)

# send email
email_status = send_email(filename, log_files)

print('Success Total: {}'.format(len(suc_log)))
print('Error Total: {}'.format(len(err_log)))
print("Email status: {}".format(email_status.status_code))

