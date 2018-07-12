import requests
from app.config import tokenURI, rtData
from app.handler import getValue, handleGeolocation

def refreshData():
    tokens = requests.post(tokenURI, rtData).json();
    return tokens['refresh_token']

def getAccessToken():
    account = {
        'client_id':'curl',
        'refresh_token': refreshData(),
        'grant_type':'refresh_token'
    }
    account = requests.post(tokenURI, account).json();
    return account['access_token']

def getResponse(url):
    header = {
        'Authorization':'Bearer ' + getAccessToken(),
        'Accept': 'application/vnd.akvo.flow.v2+json',
        'User-Agent':'python-requests/2.14.2'
    }
    response = requests.get(url, headers=header).json()
    return response

def getForm(survey):
    instanceURI = survey.get('formInstancesUrl','')
    formData = getResponse(instanceURI)
    formInstances = formData['formInstances']
    while 'nextPageUrl' in formData:
        formObj = getResponse(formData['nextPageUrl'])
        if formObj['formInstances']:
            formInstances = formInstances + formData['formInstances']
    return formInstances


def setMetaAttr(data):
    data['Identifier']=[]
    data['Device identifier']=[]
    data['Instance']=[]
    data['Submission Date']=[]
    data['Submitter']=[]
    data['Duration']=[]

def setMetaData(formI,data):
    data['Identifier'].append(formI.get('identifier',""))
    data['Instance'].append(formI.get('id',""))
    data['Device identifier'].append(formI.get('deviceIdentifier',""))
    data['Submitter'].append(formI.get('submitter',""))
    data['Submission Date'].append(formI.get('submissionDate',""))
    data['Duration'].append(formI.get('surveyalTime',""))

def setQuestionAttr(survey,qMap,finalData):
    setMetaAttr(finalData)
    for qGroups in survey['questionGroups']:
        for question in qGroups['questions']:
            qMap[question['id']]=question
            if(question['type']=='GEO'):
                colHeader=question['variableName']+'|Latitude'
                finalData[colHeader]=[]
                finalData['--GEOLON--|Longitude']=[]
            else:
                colHeader=question['variableName']
                finalData[colHeader]=[]

def setData(formInstances,qMap,finalData):
    for form in formInstances:
        formR=form["responses"]
        rMap={}
        if formR:
            for key in formR.keys():
                rMap={**rMap,**formR[key][0]}
            for qKey in qMap.keys():
                value=rMap.get(qKey)
                try:
                    if(qMap.get(qKey)["type"]=='GEO'):
                        handleGeolocation(finalData,value,qMap.get(qKey)["variableName"])
                    else:
                        text=qMap.get(qKey)["variableName"]
                        finalData[text].append(getValue(value,qMap.get(qKey)))
                except:
                    print(form,qKey,value)
            setMetaData(form,finalData)

