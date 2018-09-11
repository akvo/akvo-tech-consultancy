import requests
import csv
from time import sleep

tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
rtData = {
    'client_id':'curl',
    'username': 'deden@akvo.org',
    'password': 'Jalanremaja1208',
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
        print('ERROR: TOKEN ACCESS DENIED')
        return False
    return account['access_token']

def getResponse(url,rtype):
    header = {
        'Authorization':'Bearer ' + getAccessToken(),
        'Accept': '*/*',
        'User-Agent':'python-requests/2.14.2'
    }
    if rtype == "post":
        response = requests.post(url, headers=header).json()
    else:
        response = requests.get(url, headers=header).json()
    return response

def checkUpdate(url):
    job = getResponse(url, "get")
    if job['status'] == 'OK':
        print('SUCCESS: DATASET IS UPDATED')
        return job['status']
    elif job['status'] == 'ERROR':
        print('ERROR: '+ url +' FAILED TO LOAD')
        return False
    else:
        print('INFO:PENDING...')
        print('INFO:WAITING NEXT RESPONSE IN 10 SECONDS')
        sleep(10)
        checkUpdate(url)

def updateDataset(instance, dataset):
    api = 'https://' + instance + '.akvolumen.org/api/'
    data = getResponse(api+ 'datasets/' + dataset + '/update', "post")
    check = api + "job_executions/" + data['updateId']
    checkUpdate(check)

with open('datasets.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    print('--- STARTING TO UPDATE ---')
    for idx, row in enumerate(reader):
        instance = row['instance']
        dataset = row['dataset']
        print('INFO: UPDATING INSTANCE https://' + instance + '.akvolumen.org' + ' DATASET ID[' + dataset + ']')
        if idx <= 5:
            updateDataset(instance, dataset)
        else:
            print('WARNING:USAGE LIMIT EXCEEDED')
    print('--- JOB IS DONE ---')
