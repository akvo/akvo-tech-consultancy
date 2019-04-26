from Akvo import Flow
import pandas as pd
import inquirer
import os

token = Flow.getToken()

def getList(iName):
    instanceURL = "https://"+iName+".akvolumen.org/api/"
    dashboards = Flow.getData(instanceURL + 'library', token)
    datasets = pd.DataFrame(dashboards['datasets'])
    datasets['api'] = datasets['id'].apply(lambda x: instanceURL + 'datasets/' + x)
    dataName = list(datasets['name'])
    return dataName
def getFile(iName,dataName):
    instanceURL = "https://"+iName+".akvolumen.org/api/"
    dashboards = Flow.getData(instanceURL + 'library', token)
    datasets = pd.DataFrame(dashboards['datasets'])
    datasets['api'] = datasets['id'].apply(lambda x: instanceURL + 'datasets/' + x)
    dataPath = list(datasets.loc[datasets['name'] == dataName]['api'])[0]
    data = Flow.getData(dataPath, token)
    columns = list(pd.DataFrame(data['columns'])['title'])
    rows = pd.DataFrame(data['rows'], columns=columns)
    downloadName = iName + '_' + dataName + '.csv'
    downloadName = downloadName.replace(' ','_')
    dir_path = os.path.dirname(os.path.realpath(__file__))
    rows.to_csv(downloadName)
    print("Downloaded to" + dir_path + '/' + downloadName)

questions = [
    inquirer.Text('name',message="Nama Instance")
]

instanceID = inquirer.prompt(questions)

questions = [
    inquirer.List('dataName',message="Datasets Name",choices=getList(instanceID['name']))
]
answers = inquirer.prompt(questions)
getFile(instanceID['name'],answers['dataName'])
