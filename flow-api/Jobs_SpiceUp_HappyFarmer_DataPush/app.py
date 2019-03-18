
print('\n')
print('o  o                        o--o')
print('|  |                        |')
print('O--O  oo o-o  o-o  o  o     O-o   oo o-o o-O-o o-o o-')
print('|  | | | |  | |  | |  |     |    | | |   | | | |-+ |')
print('o  o o-o-O-o  O-o  o--O     o    o-o-o   o o o o-o o')
print('         |    |       |')
print('         o    o    o--o')
print('\n')

import requests as r
import pandas as pd
import time
import os
from app.FlowHandler import FlowHandler

start_time = time.time()

class checkTime:
    def __init__(self):
        total_time = time.time() - start_time
        self.current = time.strftime("%H:%M:%S", time.gmtime(total_time))

class AkvoFlow:
    def __init__(self, pathURI):
        authentification = {
            'client_id':'curl',
            'username': os.environ['KEYCLOAK_USER'],
            'password': os.environ['KEYCLOAK_PWD'],
            'grant_type':'password',
            'scope':'openid offline_access'
        }
        tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
        tokens = r.post(tokenURI, authentification).json();
        response = r.get(pathURI, headers={
            'Authorization':'Bearer ' + tokens['access_token'],
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        }).json()
        self.data = response
        self.tb = pd.DataFrame(response)

class HappyFarmer:
    def __init__(self):
        self.url = 'https://parseapi.back4app.com/'
        self.app_id = os.environ['HF_APP_ID']
        self.key = os.environ['HF_KEY']
        self.usr = os.environ['HF_USER']
        self.pwd = os.environ['HF_PWD']

class getRefreshToken:
    def __init__(self):
        hf = HappyFarmer()
        headers = {
            'x-parse-application-id': hf.app_id,
            'x-parse-client-key': hf.key
        }
        req = r.get(hf.url + 'login?username='+ hf.usr +'&password=' + hf.pwd + '&=', headers = headers)
        headers.update({'x-parse-session-token':req.json().get('sessionToken')})
        self.token = headers

class getData:
    def __init__(self, url):
        hf = HappyFarmer()
        hdr = getRefreshToken()
        self.url = url
        self.data = r.get(hf.url + 'classes/' + url, headers = hdr.token).json()
        res = self.data.get('results')
        self.tb = pd.DataFrame(res)

class postData:
    def __init__(self, url, data):
        hf = HappyFarmer()
        hdr = getRefreshToken()
        self.url = url
        self.inputs = data
        self.send = r.post(hf.url + 'classes/' + url, headers = hdr.token, json = data).json()

class deleteData:
    def __init__(self, url, data):
        hf = HappyFarmer()
        hdr = getRefreshToken()
        self.url = url
        self.inputs = data
        self.send = r.delete(hf.url + 'classes/' + url + '/' + data, headers = hdr.token).json()

def fetchData(surveyId,formId,DropQuestions,VariableQuestions,LocVar):
    dataPoints = []
    linkr1 = 'https://api.akvo.org/flow/orgs/spiceup/form_instances?survey_id='
    linkr2 = '&form_id='
    linkr3 = '&cursor='
    def getAll(url):
        req = AkvoFlow(url)
        formInstances = req.data['formInstances']
        for dataPoint in formInstances:
            dataPoints.append(dataPoint)
        try:
            url = req.data['nextPageUrl']
            url_replaced = url.replace(linkr1,'').replace(linkr2,' | ').replace(linkr3,' | ')
            print(checkTime().current + ' GET DATA [' + url_replaced + ']')
            getAll(url)
        except:
            return "done"
        return

    req = AkvoFlow('https://api.akvo.org/flow/orgs/spiceup/surveys/'+surveyId)
    apiData = req.data['forms']
    details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]
    questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
    for i,k in enumerate(apiData):
        if k['id'] == formId:
            Index = int(i)
    meta = questions(apiData[Index]['questionGroups'])
    mt = pd.DataFrame(meta)
    groupID = mt['id'][0]
    metadata = mt['questions'][0]
    getAll('https://api.akvo.org/flow/orgs/spiceup/form_instances?survey_id='+surveyId+'&form_id='+formId)
    formName = apiData[Index]['name']
    print(checkTime().current + ' FETCH DATA FROM ' + formName.upper())
    output = pd.DataFrame(dataPoints)
    print(checkTime().current + ' TRANSFORMING ' + formName.upper())
    for qst in metadata:
        qName = qst['name'].replace('_',' ')
        qId = str(qst['id'])
        qType = qst['type']
        output[qName] = output['responses'].apply(lambda x: FlowHandler(x[groupID],qId,qType))
        if qType == 'GEO':
            output[qName+'_latitude'] = output[qName].apply(lambda x: x[0] if x is not None else 0).astype(int)
            output[qName+'_longitude'] = output[qName].apply(lambda x: x[1] if x is not None else 0).astype(int)
            output = output.drop([qName], axis=1)
    print(checkTime().current + ' DONE TRANSFORMING ' + formName.upper())
    output = output.drop(['responses'], axis=1)
    def getPointer(var,classname,indexno):
        return { "__type" : "Pointer",
                "className" : classname,
                "objectId" : var.split('|')[indexno].split(':')[0]}

    output['Village'] = output[LocVar].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Village',3))
    output['SubDistrict'] = output[LocVar].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'SubDistrict',2))
    output['District'] = output[LocVar].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'District',1))
    output['Province'] = output[LocVar].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Province',0))
    if formName == 'Farmer Profiles':
        output['Geolocation_latitude'] = output['Geolocation_latitude'].apply(lambda x:None if (x == 0) else x)
        output['Geolocation_longitude'] = output['Geolocation_longitude'].apply(lambda x:None if (x == 0) else x)
        output['Marital Status'] = output['Marital Status'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[1])
        output['Gender'] = output['Gender'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[1])
        output['Registration Number'] = output['Registration Number'].fillna(0).astype(int)
        output['Registration Number'] = output['Registration Number'].apply(lambda x:None if (x == 0) else str(x))
        output['Phone Number'] = output['Phone Number'].fillna(0).astype(int)
        output['Phone Number'] = output['Phone Number'].apply(lambda x:None if (x == 0) else str(x))
        #output['Type of Farmer'] = output['Type of Farmer'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Type of Farmer',0))
        output['Type of Farmer'] = output['Type of Farmer'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[1])
        output['Address'] = output['Address'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Province',1))
        output['Place of Birth'] = output['Place of Birth'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[2])
        output['Date of Birth'] = output['Date of Birth'].fillna(0).apply(lambda x:None if (x == 0) else {"__type" : "Date","iso":x.replace('.',':')})
    if formName == 'Harvest':
        output['Plot Area'] = output['Plot Area'].fillna(0).apply(lambda x:None if (x == 0) else x['features'][0]['geometry']['coordinates'][0])
        output['Variety'] = output['Variety'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Variety',0))
        output['Commodity'] = output['Commodity'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Commodity',0))
        output['Planting Date'] = output['Planting Date'].fillna(0).apply(lambda x: None if (x == 0) else {"__type" : "Date","iso":x.replace('.',':')})
        output['Farmer'] = output['identifier'].fillna(0).apply(lambda x: None if (x == 0) else getData('SbxFarmer?where={"Akvo":"'+ x +'"}').data['results'][0])
        output['identifier'] = output[['identifier', 'id']].fillna(0).apply(lambda x: None if (x == 0) else '_'.join(x), axis=1)
        output['Name'] = output['Farmer'].fillna(0).apply(lambda x:None if (x == 0) else x['Name'])
        output['Farmer'] = output['Farmer'].fillna(0).apply(
            lambda x: None if (x == 0) else {"__type" : "Pointer","className": "SbxFarmer","objectId": x['objectId']}
        )
    if formName == 'Farm Registration':
        SbxFarmer = getData('SbxFarmer?limit=1000').tb
        def GetFarmerId(akvoId):
            ids = None
            try:
                ids = SbxFarmer['objectId'].loc[SbxFarmer['Akvo'] == akvoId].values[0]
            except:
                pass
            return ids
        output['Plot Area'] = output['Plot Area'].fillna(0).apply(lambda x:None if (x == 0) else x['features'][0]['geometry']['coordinates'][0])
        output['Variety'] = output['Variety'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Variety',0))
        output['Commodity'] = output['Commodity'].fillna(0).apply(lambda x:None if (x == 0) else getPointer(x,'Commodity',0))
        output['Pole Type'] = output['Pole Type'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[1])
        output['Farm Status'] = output['Farm Status'].fillna(0).apply(lambda x:None if (x == 0) else x.split(':')[1])
        output['Number of Plants'] = output['Number of Plants'].fillna(0).apply(lambda x: 0 if (x == 0) else x)
        output['Age'] = output['Age'].fillna(0).astype(int)
        output['Total Area (Hectare)'] = output['Total Area (Hectare)'].fillna(0).astype(int)
        output['Plant Date'] = output['Plant Date'].fillna(0).apply(lambda x:None if (x == 0) else {"__type" : "Date","iso":x.replace('.',':')})
        output['Farmer'] = output['Farmer Registration ID'].fillna(0).apply(
            lambda x: None if (x == 0) else {"__type" : "Pointer","className": "SbxFarmer","objectId": GetFarmerId(x)}
        )
    output = output.drop(DropQuestions,axis=1)
    output = output.rename(columns=VariableQuestions)
    output = output.to_dict(orient='records')
    return output


def postFarmerProfile():
    print('FARMER PROFILE UPDATE IS STARTED =====================\n')
    farmerProfileDrop = ['createdAt','deviceIdentifier','dataPointId','id',
                'displayName','formId','modifiedAt',
                'submissionDate','submitter','surveyalTime']
    farmerProfileVariable = {
        "Type of Farmer":"FarmerType",
        "Registration Number":"RegistrationNumber",
        "Marital Status":"MaritalStatus",
        "Detail Address":"Address",
        "Place of Birth":"BirthPlace",
        "Date of Birth":"BirthDate",
        "Phone Number":"PhoneNumber",
        "identifier":"Akvo",
        "Geolocation_latitude":"Latitude",
        "Geolocation_longitude":"Longitude"
    }
    farmerProfiles = fetchData('249380481','247570373',farmerProfileDrop,farmerProfileVariable,'Address')
    print(checkTime().current + ' POST NEW FARMER PROFILE DATA')
    hasRegistered = []
    hasRegistered = getData('SbxFarmer?limit=1000')
    for postProfile in farmerProfiles:
        #farmerPhoto = postProfile['Photo of Farmer']
        if 'Photo of Farmer' in postProfile: del postProfile['Photo of Farmer']
        #if 'BirthDate' in postProfile: del postProfile['BirthDate']
        def recordFarmer():
            res = postData('SbxFarmer',postProfile)
            res = res.send
            print(checkTime().current + ' ' + res['objectId'].upper() + ' NEW PROFILE ADDED ✪')
        try:
            url = hasRegistered.data['results']
            if postProfile['Akvo'] not in list(pd.DataFrame(url)['Akvo']):
                recordFarmer()
            else:
                print(checkTime().current + ' ' + postProfile['Akvo'].upper() + ' IS REGISTERED')
                pass
        except:
            recordFarmer()
    print('\nFARMER PROFILE IS UPDATED ============================\n')

def postFarms():
    print('FARM UPDATE IS STARTED ========================\n')
    farmDrop = ['createdAt','deviceIdentifier','dataPointId','id','Farmer Registration ID',
                'displayName','formId','modifiedAt','Farm Location',
                'submissionDate','submitter','surveyalTime']
    farmVariable = {
        "Number of Plants":"PlantNumber",
        "Plant Date":"PlantDate",
        "Pole Type":"PoleType",
        "Harvest Date":"Year",
        "Yield (Kg)":"Yield",
        "Total Area (Hectare)":"Area",
        "Plot Area":"PolygonArray",
        "identifier":"Akvo"
    }
    farms = fetchData('245360436','235370382',farmDrop,farmVariable,'Farm Location')
    print(checkTime().current + ' ' + 'START CHECKING ' + str(len(farms)) + ' DATA')
    hasRegistered = []
    hasRegistered = getData('SbxFarm?limit=1000')
    for postFarm in farms:
        if 'Farm Status' in postFarm: del postFarm['Farm Status']
        def recordFarm():
            res = postData('SbxFarm',postFarm)
            res = res.send
            print(checkTime().current + ' ' + res['objectId'].upper() + ' NEW FARM ADDED ✪')
        try:
            url = hasRegistered.data['results']
            if postFarm['Akvo'] not in list(pd.DataFrame(url)['Akvo']):
                recordFarm()
            else:
                print(checkTime().current + ' ' + postFarm['Akvo'].upper() + ' IS REGISTERED')
                pass
        except:
            recordFarm()
    print('\n\nFARM IS UPDATED ============================\n')

postFarmerProfile()
postFarms()

