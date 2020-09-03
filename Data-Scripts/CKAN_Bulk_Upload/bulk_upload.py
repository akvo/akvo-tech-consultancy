import os
import pandas as pd
from ckanapi import RemoteCKAN, NotAuthorized
from unidecode import unidecode

CKAN_APIKEY = os.environ['DEVDATASHARE_APIKEY'] # change with yours
CKAN_URL = 'https://dev-datashare.org'
AUTHOR = 'Akvo' # or any author name

ua = 'ckanapi/1.0'
demo = RemoteCKAN(CKAN_URL, apikey=CKAN_APIKEY, user_agent=ua)

def new_resources(bulk):
    group = bulk['groups'].lower()
    name = bulk['name'].lower().replace(' ','_').replace('(','').replace(')','').replace(',','_').replace("'","")
    name = unidecode(name).lower()
    try:
        # assuming that 'watershed-{'groupname'} is exist (e.g watershed-ghana)'
        pkg = demo.action.package_create(
            name=str(bulk['pid']) + '_' + name[:50],
            title=bulk['title'] + ' - ' + group.title(),
            url='https://watershed.nl',
            groups=[{'name':'watershed-' + group}],
            author=AUTHOR,
            owner_org='watershed')
        for file in bulk['files']:
            filetype = file.split('.')[1]
            filepath = './'+group+'/'+file
            if filetype == 'csv':
                #assuming that data is raw data-cleaning from Akvo Flow
                csvfile = pd.read_csv(filepath, skiprows=1)
                csvfile.to_csv(file)
                filepath = file
            try:
                demo.action.resource_create(
                    package_id = pkg['id'],
                    name=unidecode(file[:50]).lower(),
                    upload=open(filepath, 'rb'))
            except:
                print(file + ' not uploaded')
        print(bulk['name'] + "Successfully uploaded")
    except NotAuthorized:
        print('Access Denied')

data = pd.read_csv('data-ghana.csv')
data['title'] = data['title'].apply(unidecode)
data['title'] = data['title'].apply(lambda x: x.title())
data_list = data[['groups','pid','title']].groupby('pid').first().reset_index().to_dict('records')

bulklist = []
for d in data_list:
    d.update({'name':d['title']})
    files = data[data['pid'] == d['pid']]
    files = files['files'].to_list()
    d.update({'files': files})
    bulklist.append(d)

for bulk in bulklist:
    new_resources(bulk)

