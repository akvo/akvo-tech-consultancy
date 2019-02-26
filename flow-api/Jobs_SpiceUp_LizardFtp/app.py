from datetime import datetime,timedelta
from pytz import utc, timezone
import time
from Akvo import Flow
from FlowHandler import FlowHandler
import pandas as pd
import json

instanceURI = 'spiceup'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
FarmDetails = Flow.getResponse(requestURI + '/surveys/8710001')
FarmerProfiles = Flow.getResponse(requestURI + '/surveys/18020001')
start_time = time.time()
date_format = '%Y-%m-%dT%H:%M:%SZ'

def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent

def fileDate():
    return datetime.now().strftime("_%Y_%m_%d_%H%M")

questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]

def getAll(url, dataPoints):
    dataPoints = dataPoints
    data = Flow.getResponse(url)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        print(checkTime(time.time()) + ':: GET DATA FROM[' + url + ']')
        url = data.get('nextPageUrl')
        getAll(url, dataPoints)
    except:
        print(checkTime(time.time()) + ':: DOWNLOAD COMPLETE')
    return dataPoints

def getData(surveyData):
    forms = surveyData.get('forms')
    allResponses = {}
    for form in forms:
        questionGroups = questions(form['questionGroups'])
        metas = pd.DataFrame(questionGroups)
        formURI = form['formInstancesUrl']
        allGroups = {}
        for index, questionGroup in enumerate(questionGroups):
            groupID = questionGroup['id']
            metadata = metas['questions'][index]
            dataPoints = getAll(formURI, [])
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
    return allResponses

## BEGIN TRANSACTION

FarmerProfilesData = getData(FarmerProfiles)
with open('FarmerProfilesData'+fileDate()+'.json', 'w') as fp:
    json.dump(FarmerProfilesData, fp)

FarmDetailsData = getData(FarmDetails)
with open('FarmDetails'+fileDate()+'.json', 'w') as fp:
    json.dump(FarmDetailsData, fp)

