

```python
import os
import requests as r
import pandas as pd
from ckanapi import RemoteCKAN, NotAuthorized
from unidecode import unidecode
```


```python
CKAN_APIKEY = os.environ['DEVDATASHARE_APIKEY'] # change with yours
CKAN_URL = 'https://dev-datashare.org'
AUTHOR = 'Akvo' # or any author name
```


```python
ua = 'ckanapi/1.0'
demo = RemoteCKAN(CKAN_URL, apikey=CKAN_APIKEY, user_agent=ua)
```


```python
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
            filename = name + '.' + filetype
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
```

**Data Upload Example Structure**
- assuming that files are in **./ghana/..filename**
- pid is numeric value to create new dataset in ckan so it could have uniq name value
- if you want to add multiple files in one dataset, pid should be same


```python
data = pd.read_csv('data-ghana.csv')
data[0:3]
```

<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>groups</th>
      <th>pid</th>
      <th>title</th>
      <th>files</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>Ghana</td>
      <td>2</td>
      <td>Survey Standpipe Survey</td>
      <td>RD_Standpipe - Raw Data.csv</td>
    </tr>
    <tr>
      <th>1</th>
      <td>Ghana</td>
      <td>2</td>
      <td>Survey Standpipe Survey</td>
      <td>SURVEY_Standpipe - Paper Survey.pdf</td>
    </tr>
    <tr>
      <th>2</th>
      <td>Ghana</td>
      <td>3</td>
      <td>Survey Service authority and support</td>
      <td>SURVEY_Service authority and support - Paper S...</td>
    </tr>
  </tbody>
</table>
</div>


```python
data['title'] = data['title'].apply(unidecode)
data['title'] = data['title'].apply(lambda x: x.title())
```


```python
data_list = data[['groups','pid','title']].groupby('pid').first().reset_index().to_dict('records')
```


```python
bulklist = []
for d in data_list:
    d.update({'name':d['title']})
    files = data[data['pid'] == d['pid']]
    files = files['files'].to_list()
    d.update({'files': files})
    bulklist.append(d)
```


```python
for bulk in bulklist:
    new_resources(bulk)
```
