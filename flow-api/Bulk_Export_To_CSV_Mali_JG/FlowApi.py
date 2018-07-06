import os
import sys
import shutil
import requests
import pandas as pd
import json
import numpy as np
from collections import OrderedDict
import time
import traceback
import logging
import pdb


rtData={
    "client_id":"curl",
    "username":os.environ["KEYCLOAK_USER"],
    "password":os.environ["KEYCLOAK_PWD"],
    "grant_type":"password",
    "scope":"openid offline_access"
}
refreshData=requests.post("https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token",rtData).json();

def getAccessToken():
    acData={
    "client_id":"curl",
    "refresh_token":refreshData["refresh_token"],
    "grant_type":"refresh_token"
    }
    accessData = requests.post("https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token",acData).json()
    return accessData["access_token"]


def getResponse(url):
    # print(url)
    header={
        "Authorization":"Bearer "+ getAccessToken() ,
        "Accept": "application/vnd.akvo.flow.v2+json",
        "User-Agent": "python-requests/2.14.2"
        }
    response=requests.get(url,headers=header).json()
    # print(response)
    return response

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

def getValue(value,question):
    qType=question.get('type',"")
    if(value==None):
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

def setMetaAttributes(data):
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

def getFormData(surveyForm):
    instanceURL=surveyForm.get('formInstancesUrl',"")
    formObj=getResponse(instanceURL)
    formInstances=formObj['formInstances']
    while 'nextPageUrl' in  formObj:
        formObj=getResponse(formObj['nextPageUrl'])
        if formObj['formInstances']:
            formInstances=formInstances+formObj['formInstances']
    return formInstances

def setQuestionAttributes(surveyForm,qMap,finalData):
    setMetaAttributes(finalData)
    for qGroups in surveyForm['questionGroups']:
        for question in qGroups['questions']:
            qMap[question['id']]=question
            if(question['type']=='GEO'):
                colHeader=question['variableName']+'|Latitude'
                finalData[colHeader]=[]
                finalData['--GEOLON--|Longitude']=[]
            else:
                colHeader=question['variableName']
                finalData[colHeader]=[]        

def createFile(finalData,filename):
    try:
        df=pd.DataFrame(finalData,columns=finalData.keys())
        df.to_csv(filename,index=False)
    except Exception as e:
        print(filename)
        logging.error(traceback.format_exception_only())
        
    

def setData(formInstances,qMap,finalData):
    for form in formInstances:
        # setMetaData(form,finalData)
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

def createFolder(path):
    pathC=path.split('/')
    currentPath='datafiles'
    for node in pathC:
        currentPath=currentPath+"/"+node.split('|')[0]
        if not os.path.exists(currentPath):
            os.makedirs(currentPath)
    return currentPath

surveysMap=OrderedDict()


def downloadData():
#     url='https://api.akvo.org/flow/orgs/da-mha-mauritanie/surveys/72430936'
    if os.path.exists('datafiles'):
        shutil.rmtree('datafiles')
        os.makedirs('datafiles')
    else:
        os.makedirs('datafiles')
    for path,url in surveysMap.items():
        survey=getResponse(url)
        path=createFolder(path)
        if(survey.get('forms')):
            for surveyForm in survey['forms']:
                try:
                    formname=surveyForm.get('name',"No Form Name")[0:2]+'_'+surveyForm.get('id')+".csv"
                    formname=formname.replace('/','_')
                    filename=path+"/"+formname
                    formInstances=getFormData(surveyForm)
                    qMap=OrderedDict()
                    finalData=OrderedDict()
                    setQuestionAttributes(surveyForm,qMap,finalData)
                    setData(formInstances,qMap,finalData)
                    createFile(finalData,filename)
                except Exception as e:
                    logging.error(traceback.format_exception_only())
                    print(filename)
        else:
            print('No forms found')

def addSurveys(url,foldername):
    surveys=getResponse(url)
    if(surveys.get('surveys')):
        for survey in surveys['surveys']:
            surveyname=survey.get('name')+"|"+survey.get('id')
            surveyname=surveyname.replace('/','_')
            surveyname=foldername+"/"+surveyname
            surveysMap[surveyname]=survey.get('surveyUrl')
    # else:
    #     print('Survey not found')

def iterateFolderMap(folderMap):
    while(len(folderMap)>0):
        key=list(folderMap.items())[0][0]
        url=list(folderMap.items())[0][1]
        folders=getResponse(url)
        if folders['folders']:
            for folder in folders['folders']:
                foldername=folder.get('name')+"|"+folder.get('id')
                foldername=foldername.replace('/','_')
                foldername=key+"/"+foldername
                folderMap[foldername]=folder.get('foldersUrl')
                addSurveys(folder.get('surveysUrl'),foldername)
            folderMap.pop(key)
        else:
            folderMap.pop(key)       

def createSurveysMap(instance,folderId):
    folderMap={}
    foldersURL='https://api.akvo.org/flow/orgs/'+instance+'/folders?parent_id='+folderId
    folders=getResponse(foldersURL)
    surveysURL='https://api.akvo.org/flow/orgs/'+instance+'/surveys?folder_id='+folderId
    addSurveys(surveysURL,'')
    if(folders.get('folders')):
        for folder in folders['folders']:
            foldername=folder.get('name')+"|"+folder.get('id')
            foldername=foldername.replace('/','_')
            folderMap[foldername]=folder.get('foldersUrl')
            iterateFolderMap(folderMap)
            addSurveys(folder.get('surveysUrl'),foldername)
    # else:
    #     print('Folder not found')

def downloadSurveyList():
    surveyList=OrderedDict()
    surveyList['Surveys']=[]
    for k,v in surveysMap.items():
        surveyList['Surveys'].append(k)
    df=pd.DataFrame(surveyList,columns=surveyList.keys())
    if os.path.exists('datafiles'):
        df.to_csv('datafiles/surveys.csv',index=False)

t=time.process_time()
instance=str(sys.argv[1])
identifier=str(sys.argv[3])
if (str(sys.argv[2])=='folder'):
    createSurveysMap(instance,identifier)
    surveysMap=OrderedDict(sorted(surveysMap.items()))
    downloadData()
    downloadSurveyList()    
elif (str(sys.argv[2])=='survey'):
    surveysMap['/']='https://api.akvo.org/flow/orgs/'+instance+'/surveys/'+identifier
    downloadData()
else:
    print('Incorrect entity type. Permitted values are "folder" or "survey"')
if(len(list(surveysMap.keys()))==0):
    print('No surveys of folders matched the Identifier')
print(time.process_time()-t)
