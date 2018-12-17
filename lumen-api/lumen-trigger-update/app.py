import csv
from time import sleep
from Akvo import Flow

token = Flow.getToken()
print(token)

def getResponse(url,rtype):
    if rtype == "post":
        response = Flow.postData(url, token)
    else:
        response = Flow.getData(url, token)
    return response

def checkUpdate(url):
    print('INFO   : TRIGGER ' + url)
    job = getResponse(url, "get")
    if job['status'] == 'OK':
        print('SUCCESS: DATASET IS UPDATED')
        return job['status']
    elif job['status'] == 'FAILED':
        print('ERROR  : '+ url +' FAILED TO LOAD')
        return False
    else:
        print('INFO   : PENDING...WAITING NEXT RESPONSE IN 10 SECONDS')
        sleep(10)
        checkUpdate(url)

def updateDataset(instance, dataset):
    api = 'https://' + instance + '.akvolumen.org/api/'
    try:
        data = getResponse(api+ 'datasets/' + dataset + '/update', "post")
        print(data)
        check = api + "job_executions/" + data['updateId']
        sleep(10)
        checkUpdate(check)
    except:
        return

with open('datasets.csv', newline='') as csvfile:
    reader = csv.DictReader(csvfile)
    print('--- STARTING TO UPDATE ---')
    for idx, row in enumerate(reader):
        instance = row['instance']
        dataset = row['dataset']
        print('INFO   : UPDATING INSTANCE https://' + instance + '.akvolumen.org' + ' DATASET ID[' + dataset + ']')
        if idx <= 5:
            updateDataset(instance, dataset)
        else:
            print('WARNING:USAGE LIMIT EXCEEDED')
    print('--- JOB IS DONE ---')
