
<h1>Table of Contents<span class="tocSkip"></span></h1>
<div class="toc"><ul class="toc-item"><li><span><a href="#Intro" data-toc-modified-id="Intro-1"><span class="toc-item-num">1&nbsp;&nbsp;</span>Intro</a></span></li><li><span><a href="#Settings" data-toc-modified-id="Settings-2"><span class="toc-item-num">2&nbsp;&nbsp;</span>Settings</a></span><ul class="toc-item"><li><span><a href="#Import-Library" data-toc-modified-id="Import-Library-2.1"><span class="toc-item-num">2.1&nbsp;&nbsp;</span>Import Library</a></span></li><li><span><a href="#Library-Setting" data-toc-modified-id="Library-Setting-2.2"><span class="toc-item-num">2.2&nbsp;&nbsp;</span>Library Setting</a></span></li><li><span><a href="#Config" data-toc-modified-id="Config-2.3"><span class="toc-item-num">2.3&nbsp;&nbsp;</span>Config</a></span><ul class="toc-item"><li><span><a href="#Data-Input" data-toc-modified-id="Data-Input-2.3.1"><span class="toc-item-num">2.3.1&nbsp;&nbsp;</span>Data Input</a></span></li><li><span><a href="#Data-Cleaning-File" data-toc-modified-id="Data-Cleaning-File-2.3.2"><span class="toc-item-num">2.3.2&nbsp;&nbsp;</span>Data Cleaning File</a></span></li><li><span><a href="#Output-Format" data-toc-modified-id="Output-Format-2.3.3"><span class="toc-item-num">2.3.3&nbsp;&nbsp;</span>Output Format</a></span></li></ul></li></ul></li><li><span><a href="#Import-Source" data-toc-modified-id="Import-Source-3"><span class="toc-item-num">3&nbsp;&nbsp;</span>Import Source</a></span><ul class="toc-item"><li><span><a href="#Export-Functions" data-toc-modified-id="Export-Functions-3.1"><span class="toc-item-num">3.1&nbsp;&nbsp;</span>Export Functions</a></span></li><li><span><a href="#Status-Preview" data-toc-modified-id="Status-Preview-3.2"><span class="toc-item-num">3.2&nbsp;&nbsp;</span>Status Preview</a></span></li><li><span><a href="#Data-Cleaning-Preview" data-toc-modified-id="Data-Cleaning-Preview-3.3"><span class="toc-item-num">3.3&nbsp;&nbsp;</span>Data Cleaning Preview</a></span></li></ul></li><li><span><a href="#Actions" data-toc-modified-id="Actions-4"><span class="toc-item-num">4&nbsp;&nbsp;</span>Actions</a></span><ul class="toc-item"><li><span><a href="#Set-Result-Index" data-toc-modified-id="Set-Result-Index-4.1"><span class="toc-item-num">4.1&nbsp;&nbsp;</span>Set Result Index</a></span></li><li><span><a href="#Merge-Dataset" data-toc-modified-id="Merge-Dataset-4.2"><span class="toc-item-num">4.2&nbsp;&nbsp;</span>Merge Dataset</a></span></li><li><span><a href="#Generate-Result" data-toc-modified-id="Generate-Result-4.3"><span class="toc-item-num">4.3&nbsp;&nbsp;</span>Generate Result</a></span></li><li><span><a href="#Drop-Display-Name" data-toc-modified-id="Drop-Display-Name-4.4"><span class="toc-item-num">4.4&nbsp;&nbsp;</span>Drop Display Name</a></span></li></ul></li><li><span><a href="#Result-Overview" data-toc-modified-id="Result-Overview-5"><span class="toc-item-num">5&nbsp;&nbsp;</span>Result Overview</a></span><ul class="toc-item"><li><span><a href="#Available-Data" data-toc-modified-id="Available-Data-5.1"><span class="toc-item-num">5.1&nbsp;&nbsp;</span>Available Data</a></span></li><li><span><a href="#Data-Not-Found" data-toc-modified-id="Data-Not-Found-5.2"><span class="toc-item-num">5.2&nbsp;&nbsp;</span>Data Not Found</a></span></li></ul></li><li><span><a href="#Export-Result" data-toc-modified-id="Export-Result-6"><span class="toc-item-num">6&nbsp;&nbsp;</span>Export Result</a></span><ul class="toc-item"><li><span><a href="#Overview" data-toc-modified-id="Overview-6.1"><span class="toc-item-num">6.1&nbsp;&nbsp;</span>Overview</a></span></li></ul></li></ul></div>

# Intro

This code created due to repeat request from our partner to check wether the datapoint is uploaded to the dashboard or not due to the glitch in app that sometimes stuck in submitted icon.

NP: _I write this during my leasure time, no project hurts by me_

Contact: [Dedensky](mailto:deden@akvo.org)

# Settings

## Import Library


```python
import pandas as pd
from datetime import datetime
```

## Library Setting


```python
pd.set_option('mode.chained_assignment', None)
```

## Config

### Data Input


```python
INPUT_FILE = './data/UI numbers for Nikki.xlsx'
```

**INPUT_FILE** : the list of the data to be confirmed (format should be excel or csv).


- **Input file expecting identifier column for the datapoint ID**
- **Input file can have many columns, it will keep the other columns as result**

Example format:
<table>
    <tr>
        <td>Identifier</td> 
        <td>Device</td>
        <td>Other Column</td>
        <td>...</td>
        <td>More Column</td>
    </tr>
    <tr>
        <td>t9v0-95vy-c8mp</td>
        <td>Tablet 44</td>
        <td>any val</td>
        <td>...</td>
        <td>any val</td>
    </tr>
    <tr>
        <td>1by2-pqcu-8b64</td>
        <td>Tablet 48</td>
        <td>any value</td>
        <td>...</td>
        <td>any val</td>
    </tr>
</table>

### Data Cleaning File


```python
DATA_CLEANING_FILE = './data/DATA_CLEANING-87691144.xlsx'
```

**DATA_ANALYSIS_FILE** : data analysis that you exported from instance / workspace. Go to export, choose data cleaning.

Note that the results will only keep this columns from the **DATA_CLEANING_FILE**, Display Name is optional, see [Result Config](#Result-Config)

<table>
    <tr>
        <td>Identifier</td>
        <td>Display Name</td>
        <td>Device identifier</td>
        <td>Instance</td>
        <td>Submission Date</td>
        <td>Submitter</td>
        <td>Duration</td>
        <td>Form version</td>
    </tr>
    <tr>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
        <td>...</td>
    </tr>
</table>

### Output Format

**DISPLAY_NAME** Boelean (_Default: False_)


```python
DISPLAY_NAME = False
```

**OUTPUT_FORMAT** String (_Options: 'excel','csv' | Default: 'csv'_)


```python
OUTPUT_FORMAT = 'csv'
```

**OUTPUT_SORT_BY** String (_Options: 'date','device',Default: 'date'_)
- date : Submision Date
- device : Device Identifier


```python
OUTPUT_SORT_BY = 'device'
```

**OUTPUT_NAME** String (_'any value'_)


```python
OUTPUT_NAME = '87691144'
```

# Import Source

## Export Functions


```python
def getDataFrame(file):
    fmt = file[-3:]
    data = 'error'
    if fmt == 'csv':
        try:
            data = pd.read_csv(file)
        except:
            pass
    if 'x' in fmt:
        try:
            data = pd.read_excel(file)
        except:
            pass
    return data

if OUTPUT_SORT_BY.lower() == 'date':
    OUTPUT_SORT_BY = 'submission date'
else:
    OUTPUT_SORT_BY = 'device identifier'
```


```python
status = getDataFrame(INPUT_FILE)
data = pd.read_excel(DATA_CLEANING_FILE, skiprows=1)
data = data[list(data)[0:8]]
```

## Status Preview


```python
status.columns = map(str.lower, status.columns)
status[:2]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>status</th>
      <th>identifier</th>
      <th>tablet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>not uploading, showing submitted symbol</td>
      <td>t9v0-95vy-c8mp</td>
      <td>Tablet 44</td>
    </tr>
    <tr>
      <th>1</th>
      <td>not uploading, showing submitted symbol</td>
      <td>1by2-pqcu-8b64</td>
      <td>Tablet 44</td>
    </tr>
  </tbody>
</table>
</div>



## Data Cleaning Preview


```python
data.columns = map(str.lower, data.columns)
data[:2]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>identifier</th>
      <th>display name</th>
      <th>device identifier</th>
      <th>instance</th>
      <th>submission date</th>
      <th>submitter</th>
      <th>duration</th>
      <th>form version</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>p037-wr6k-m70t</td>
      <td>Honiara - Kukum - Kukum - 31-35 - Female</td>
      <td>SUSTINEOTAB30</td>
      <td>302841116</td>
      <td>13-02-2019 23:27:30 UTC</td>
      <td>ASINA HAKEZAMAH</td>
      <td>00:26:51</td>
      <td>20</td>
    </tr>
    <tr>
      <th>1</th>
      <td>3cy6-rh9h-vv89</td>
      <td>Honiara - Kukum - Kukum - 21-25 - Male</td>
      <td>Sustineo tab 14</td>
      <td>312811217</td>
      <td>13-02-2019 23:32:09 UTC</td>
      <td>TRAVIS</td>
      <td>00:28:21</td>
      <td>20</td>
    </tr>
  </tbody>
</table>
</div>



# Actions

## Set Result Index

- Merge **STATUS_FILE** and **DATA_CLEANING_FILE** index name into a list
- Remove duplicate index name between **STATUS_FILE** and **DATA_CLEANING_FILE**


```python
result_columns = list(set(list(status) + list(data)))
result_columns
```




    ['duration',
     'display name',
     'instance',
     'submission date',
     'tablet',
     'identifier',
     'form version',
     'submitter',
     'device identifier',
     'status']



## Merge Dataset


```python
id_col = status[['identifier']]
merged = data.merge(id_col, on='identifier', how='inner')
merged = merged.merge(status, on='identifier', how='outer')
```

## Generate Result


```python
result = merged.sort_values(by=[OUTPUT_SORT_BY]).fillna('-')
result['status'] = result['submitter'].apply(lambda x: 'Not Found' if x == '-' else 'Success')
```

## Drop Display Name

Optional, refers to [Result Config](#Result-Config)


```python
if DISPLAY_NAME == False:
    result = result.drop(columns=['display name'])
```

# Result Overview

## Available Data


```python
available = result[result['submitter'] != '-']
available['submission date'] = pd.to_datetime(available['submission date'], format='%d-%m-%Y %H:%M:%S UTC')
available = available.sort_values(by=[OUTPUT_SORT_BY])
print(str(len(available)) + " rows found")
```

    25 rows found


## Data Not Found


```python
not_found = result[result['submitter'] == '-'][list(status)]
print(str(len(not_found)) + " rows is not found")
```

    16 rows is not found


# Export Result


```python
nowdate = datetime.now().strftime("_%Y-%m-%d_%H-%M-%S_")
result = not_found.append(available).fillna('-')
result = result[list(available)]
if OUTPUT_SORT_BY == 'device':
    result = result.sort_values(by=[OUTPUT_SORT_BY])
```

## Overview


```python
available[:1]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>identifier</th>
      <th>device identifier</th>
      <th>instance</th>
      <th>submission date</th>
      <th>submitter</th>
      <th>duration</th>
      <th>form version</th>
      <th>status</th>
      <th>tablet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>p77t-27gd-mtx5</td>
      <td>SUSTINEOTAB21</td>
      <td>3.15221e+08</td>
      <td>2019-02-22 23:15:24</td>
      <td>ANDREW MEIOKO</td>
      <td>00:25:57</td>
      <td>23</td>
      <td>Success</td>
      <td>Tablet 21</td>
    </tr>
  </tbody>
</table>
</div>




```python
not_found[:1]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>status</th>
      <th>identifier</th>
      <th>tablet</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>25</th>
      <td>Not Found</td>
      <td>qmsj-aqwq-pj5x</td>
      <td>Tablet 44</td>
    </tr>
  </tbody>
</table>
</div>




```python
if OUTPUT_FORMAT.lower() == 'excel':
    result.to_excel('1.ALL-RESULT'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
    available.to_excel('2.AVAILABLE'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
    not_found.to_excel('3.NOT-FOUND'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
else:
    result.to_csv('1.ALL-RESULT'+ nowdate + OUTPUT_NAME +'.csv', index=False)
    available.to_csv('2.AVAILABLE'+ nowdate + OUTPUT_NAME +'.csv', index=False)
    not_found.to_csv('3.NOT-FOUND'+ nowdate + OUTPUT_NAME +'.csv', index=False)
```
