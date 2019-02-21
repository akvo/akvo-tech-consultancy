import sys
import os
from datetime import datetime
from pytz import utc, timezone
import time
from Akvo import Flow
from FlowHandler import FlowHandler
import pandas as pd

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

instanceURI = 'spiceup'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
EMAIL_RECEPIENTS = ['deden@akvo.org']
EMAIL_SENDER = 'dedenbangkit@gmail.com'

apiData = Flow.getResponse(requestURI + '/surveys/227030237')
forms = apiData.get('forms')
RegistrationForm = apiData['registrationFormId']
start_time = time.time()
date_format = '%Y-%m-%dT%H:%M:%SZ'

def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent

questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
registrationFormId = apiData.get('registrationFormId')

def getAll(url):
    data = Flow.getResponse(url)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        print(checkTime(time.time()) + ':: GET DATA FROM[' + url + ']')
        url = data.get('nextPageUrl')
        getAll(url)
    except:
        print(checkTime(time.time()) + ':: DOWNLOAD COMPLETE')
        return "done"

allResponses = {}
for form in forms:
    questionGroups = questions(form['questionGroups'])
    metas = pd.DataFrame(questionGroups)
    formURI = form['formInstancesUrl']
    allGroups = {}
    for index, questionGroup in enumerate(questionGroups):
        dataPoints = []
        groupID = questionGroup['id']
        metadata = metas['questions'][index]
        getAll(formURI)
        output = pd.DataFrame(dataPoints)
        print(checkTime(time.time()) + ':: TRANSFORMING')
        for qst in metadata:
            qName = qst['name'].replace('_',' ')
            qId = str(qst['id'])
            qType = qst['type']
            try:
                output[qName] = output['responses'].apply(lambda x: FlowHandler(x[groupID],qId,qType))
                if qType == 'GEO':
                    output[qName+'_lat'] = output[qName].apply(lambda x: x[0] if x is not None else x)
                    output[qName+'_long'] = output[qName].apply(lambda x: x[1] if x is not None else x)
                    output = output.drop([qName], axis=1)
            except:
                pass
        try:
            output = output.drop(['responses'], axis=1)
        except:
            pass
        allGroups.update({questionGroup['name']:output.to_dict('records')})
    allResponses.update({form['name']:allGroups})


fout = "./testing-real.html"
fo = open(fout, "w")
EMAIL_SENDER = 'dedenbangkit@gmail.com'
EMAIL_PASSWORD = 'Jalanremaja1208'

fo.write('<div style="padding:10px;">')
for k, v in allResponses.items():
    fo.write('<h3 style="padding:10px;background-color: green;color: white;margin-bottom:0px;">'+ k.upper() + '</h3>')
    for key, values in v.items():
        fo.write('<h4 style="color: green;">' + key + '</h4>')
        if len(values) == 0:
            fo.write('<div style="padding:10px;border:1px solid #ddd;"><h4 style="color:grey;text-align:center;">Data Not Available</h4></div>')
        for idx, value in enumerate(values):
            subDate = datetime.strptime(value['submissionDate'], date_format)
            dateWib = utc.localize(subDate).astimezone(timezone('Asia/Jakarta'))
            today_date = datetime.today().date()
            idx = idx + 1
            if idx < 10:
                index = '0' + str(idx)
            else:
                index = str(idx)
            metaText =  '<li>ID: ' + str(value['identifier']) + ' - ' + str(value['dataPointId']) + '</li>'
            metaText += '<li>Submitter: ' + str(value['submitter']) + ' (' + str(value['deviceIdentifier']) + ')</li>'
            metaText += '<li>Submission Date: ' + str(dateWib) + '</li>'
            metaText += '<li>Survey Time: ' + str(value['surveyalTime']) + ' Minutes</li>'
            notDisplayed = ['id',
                            'identifier',
                            'displayName',
                            'formId',
                            'modifiedAt',
                            'deviceIdentifier',
                            'submissionDate',
                            'submitter',
                            'dataPointId',
                            'createdAt',
                            'surveyalTime',
                            'Plot Location_long']
            if dateWib.date() == today_date:
                print(checkTime(time.time()) + ':: NEW DATA FOUND')
                metatext = '<ul>' + metaText + '</ul><hr style="border:dashed 1px #ddd;"><ul>'
                fo.write('<div style="margin-bottom:10px;padding:10px;border:1px solid #ddd;"><h4 style="margin-left: 20px;"> + DATA '+ str(index) + '</h4>' + metatext)
                for kval, ans in value.items():
                    if kval in notDisplayed:
                        pass
                    elif kval == 'Plot Location_lat':
                        ploc = str(ans) + ',' + str(value['Plot Location_long'])
                        fo.write('<li> Plot Locations: <a href="https://www.google.com/maps/?q='+str(ploc)+'" target="_blank"> Click to View</a></li>')
                    elif kval == 'Plot Shape':
                        if len(ans['features']) < 1:
                            fo.write(kval + ': ' + 'No Shape Captured</br>')
                        else:
                            geoPoints = ans['features'][0]['geometry']['coordinates'][0]
                            fo.write('<li>'  + kval + ': <ul>')
                            for ig, geoPoint in enumerate(geoPoints):
                                 fo.write('<li>' + 'Point ' + str(ig) + ': ' + str(geoPoint) + '</li>')
                            fo.write('</ul></li>')
                    else:
                        fo.write('<li>' + kval + ': ' + str(ans) + '</li>')
                fo.write('</ul>')
                fo.write('</ul></hr></div>')
            else:
                pass
fo.write('</div>')
fo.close()


msg = MIMEMultipart('alternative')
msg['Subject'] = 'Notification Proof of Concept - Using Real Survey - Testing Only'
msg['To'] = ', '.join(EMAIL_RECEPIENTS)
msg['From'] = EMAIL_SENDER

print(checkTime(time.time()) + ':: SENDING EMAIL')
with open(fout) as fp:
    msg.attach(MIMEText(fp.read(), 'html'))

try:
    with smtplib.SMTP('smtp.gmail.com', 587) as s:
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(EMAIL_SENDER, os.environ['KEYCLOAK_PWD'])
            s.send_message(msg)
            s.quit()
    print(checkTime(time.time()) + ':: EMAIL SENT')
except:
    print(checkTime(time.time()) + ':: UNABLE TO SEND THE EMAIL. ERROR:',sys.exc_info()[0])
    raise

