
<h1>Table of Contents<span class="tocSkip"></span></h1>
<div class="toc"><ul class="toc-item"><li><span><a href="#Preparation" data-toc-modified-id="Preparation-1"><span class="toc-item-num">1&nbsp;&nbsp;</span>Preparation</a></span><ul class="toc-item"><li><span><a href="#Import-Dependencies" data-toc-modified-id="Import-Dependencies-1.1"><span class="toc-item-num">1.1&nbsp;&nbsp;</span>Import Dependencies</a></span></li><li><span><a href="#Create-SQLITE-Engine" data-toc-modified-id="Create-SQLITE-Engine-1.2"><span class="toc-item-num">1.2&nbsp;&nbsp;</span>Create SQLITE Engine</a></span></li></ul></li><li><span><a href="#Data-Transforms" data-toc-modified-id="Data-Transforms-2"><span class="toc-item-num">2&nbsp;&nbsp;</span>Data Transforms</a></span><ul class="toc-item"><li><span><a href="#Import-Data" data-toc-modified-id="Import-Data-2.1"><span class="toc-item-num">2.1&nbsp;&nbsp;</span>Import Data</a></span></li><li><span><a href="#Data-Cleaning" data-toc-modified-id="Data-Cleaning-2.2"><span class="toc-item-num">2.2&nbsp;&nbsp;</span>Data Cleaning</a></span><ul class="toc-item"><li><span><a href="#Get-Numeric-Columns" data-toc-modified-id="Get-Numeric-Columns-2.2.1"><span class="toc-item-num">2.2.1&nbsp;&nbsp;</span>Get Numeric Columns</a></span></li><li><span><a href="#Exclude-Geolocation-/-Geoelevation" data-toc-modified-id="Exclude-Geolocation-/-Geoelevation-2.2.2"><span class="toc-item-num">2.2.2&nbsp;&nbsp;</span>Exclude Geolocation / Geoelevation</a></span></li><li><span><a href="#Float-Columns-to-Integer" data-toc-modified-id="Float-Columns-to-Integer-2.2.3"><span class="toc-item-num">2.2.3&nbsp;&nbsp;</span>Float Columns to Integer</a></span></li><li><span><a href="#Change-Date-Type" data-toc-modified-id="Change-Date-Type-2.2.4"><span class="toc-item-num">2.2.4&nbsp;&nbsp;</span>Change Date Type</a></span></li><li><span><a href="#Generate-Indicator-Names" data-toc-modified-id="Generate-Indicator-Names-2.2.5"><span class="toc-item-num">2.2.5&nbsp;&nbsp;</span>Generate Indicator Names</a></span></li><li><span><a href="#Generate-YEAR" data-toc-modified-id="Generate-YEAR-2.2.6"><span class="toc-item-num">2.2.6&nbsp;&nbsp;</span>Generate YEAR</a></span></li></ul></li><li><span><a href="#Overview" data-toc-modified-id="Overview-2.3"><span class="toc-item-num">2.3&nbsp;&nbsp;</span>Overview</a></span></li></ul></li><li><span><a href="#Export" data-toc-modified-id="Export-3"><span class="toc-item-num">3&nbsp;&nbsp;</span>Export</a></span><ul class="toc-item"><li><span><a href="#SQL-Lite" data-toc-modified-id="SQL-Lite-3.1"><span class="toc-item-num">3.1&nbsp;&nbsp;</span>SQL Lite</a></span></li><li><span><a href="#Database-CSV" data-toc-modified-id="Database-CSV-3.2"><span class="toc-item-num">3.2&nbsp;&nbsp;</span>Database CSV</a></span></li><li><span><a href="#Json-Config" data-toc-modified-id="Json-Config-3.3"><span class="toc-item-num">3.3&nbsp;&nbsp;</span>Json Config</a></span></li></ul></li></ul></div>

# Preparation

## Import Dependencies


```python
import pandas as pd
import string
import numpy as np
from sqlalchemy import create_engine
import json
```

## Create SQLITE Engine

This SQlite `database.db` is the default database for SIG Map DB Models


```python
engine = create_engine('sqlite:///databases.db')
```

# Data Transforms

## Import Data

1. `df` is clean database that covered missing gps from original data source
2. `df_old` is original data source from Akvo Flow + Additional indicators:
    - Province
    - Proportion of schools with basic drinking water from an improved source available at school
    - Primary Water Source (improved or not)
    - Functional Toilet
    - Single-sex basic sanitation toilet
    - Is the sanitation improved?
    - Accessibility of sanitation source to students with limited mobility


```python
df = pd.read_excel("SIG_WITH_COMPLETE GPS_V3.xlsx")
df_old = pd.read_excel("DATA_CLEANING-24520921-ALIGNED.xlsx",skiprows=1)
```

## Data Cleaning

Flow Data Cleaning is Master Data, Akvo-SIG Map by default will refer to this data, to append new data use data uploader.

### Get Numeric Columns


```python
numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
df_num = df.select_dtypes(include=numerics)
```

### Exclude Geolocation / Geoelevation


```python
df_num = df_num.drop(columns=list(df_num.columns[[-1,-2,-3,-4]]), axis=1)
```

### Float Columns to Integer


```python
df_num = df_num.fillna(0.0).astype(np.int32)
df[list(df_num)] = df_num
```

### Change Date Type


```python
df['SubmissionDate'] = df['SubmissionDate'].apply(lambda x:x.replace(' CEST','').replace(' CET',''))
df['SubmissionDate'] = pd.to_datetime(df['SubmissionDate'], format='%d-%m-%Y %H:%M:%S')
```

### Generate Indicator Names

Create indicator names as short as posible to reduce filesize when map calls all of the data


```python
indicators = list(df)
rep_indicators = [(lambda x: x.lower().replace('GEOLON',''))(x) for x in list(df)]
keyname = lambda x,y: {a:y[b] for b, a in enumerate(x)}
header = lambda a: [x.lower() if x.find("|") == -1 else x.split('|')[1].lower().replace("--other--"," other") for x in a]
header = header(list(df_old))
chars =list(string.ascii_uppercase)
chars_col = chars + [x+y for x in chars for y in chars]
index = chars_col[:len(list(df))]
json_indicators = keyname(index, header)
df.columns = index
```

### Generate YEAR

This is part of SIG v.2 new feature for the timeseries.


```python
df['YR'] = df['E'].apply(lambda x: x.strftime('%Y'))
json_indicators.update({'YR':'year'})
```

## Overview


```python
df.head(1)
```

<div>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>A</th>
      <th>B</th>
      <th>C</th>
      <th>D</th>
      <th>E</th>
      <th>F</th>
      <th>G</th>
      <th>H</th>
      <th>I</th>
      <th>J</th>
      <th>...</th>
      <th>EW</th>
      <th>EX</th>
      <th>EY</th>
      <th>EZ</th>
      <th>FA</th>
      <th>FB</th>
      <th>FC</th>
      <th>FD</th>
      <th>FE</th>
      <th>YR</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>114v-14ce-g5y1</td>
      <td>Moah Adventist Primary School</td>
      <td>mehrd/unicef</td>
      <td>134217726</td>
      <td>2018-05-11 01:06:14</td>
      <td>Rachel Maomai</td>
      <td>00:30:41</td>
      <td>GEORGE  Taweca</td>
      <td>Head Teacher</td>
      <td>7249230</td>
      <td>...</td>
      <td>57.0</td>
      <td>Rennell and Bellona</td>
      <td>Basic</td>
      <td>Improved</td>
      <td>0</td>
      <td>No Services</td>
      <td>No Toilet</td>
      <td>Inaccessible</td>
      <td>No Services</td>
      <td>2018</td>
    </tr>
  </tbody>
</table>
<p>1 rows × 162 columns</p>
</div>




```python
df.columns
```




    Index(['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
           ...
           'EW', 'EX', 'EY', 'EZ', 'FA', 'FB', 'FC', 'FD', 'FE', 'YR'],
          dtype='object', length=162)




```python
json_indicators
```




    {'A': 'identifier',
     'B': 'display name',
     'C': 'device identifier',
     'D': 'instance',
     'E': 'submission date',
     'F': 'submitter',
     'G': 'duration',
     'H': 'what is the name of the person being interviewed?',
     'I': 'what is his/her position in the school?',
     'J': 'what is the contact of the person being interviewed ? (mobile or landline)',
     'K': 'new question - please change name',
     'L': 'name of school?',
     'M': 'new question - please change name',
     'N': 'type of school?',
     'O': 'type of school? other',
     'P': 'what is the registration number of the school?',
     'Q': 'what are the schools hours of operation?',
     'R': 'how many classrooms does the school have?',
     'S': 'how may girls attend this school?',
     'T': 'how many boys attend this school?',
     'U': 'how may males teachers teach in this school?',
     'V': 'how many female teachers teach in this school?',
     'W': 'what is the name of the head teacher of this school?',
     'X': 'what is the head teachers contact? (mobile or landline)',
     'Y': 'does the school have a water source?',
     'Z': 'if yes, what is the schools primary drinking water source?',
     'AA': 'if yes, what is the schools primary drinking water source? other',
     'AB': 'please take a photo of the piped water source?',
     'AC': 'please take a photo of the protected well?',
     'AD': 'please take a photo of the unprotected well?',
     'AE': 'please take a photo of the rainwater/roof water?',
     'AF': 'please take a photo of the river/stream/sea?',
     'AG': 'please take a photo of the water brought by kids from home?',
     'AH': 'where is the primary water source located?',
     'AI': 'is the primary water source used by the communities surrounding the school as well?',
     'AJ': 'is the water treated when taken from the primary source to ensure it is safe to drink?',
     'AK': 'if treated, what sort of treatment is conducted?',
     'AL': 'if treated, what sort of treatment is conducted? other',
     'AM': 'how often is treatment done?',
     'AN': 'is the water available from the primary water source at the time of the survey?',
     'AO': 'if water is available, please take a picture of the source?',
     'AP': 'is the drinking water from the primary source available typically throughout the school year regardless of seasonal changes?',
     'AQ': 'is the primary water source accessible to all students, including small children and those with limited mobility?',
     'AR': 'if yes, please take a picture of the access to the water source for small children?',
     'AS': 'if yes, please take a picture of the access to the water source for those with limited mobility?',
     'AT': 'does the school have a another water source that is available for cleaning and other uses?',
     'AU': 'does the school have a another water source that is available for cleaning and other uses? other',
     'AV': 'does the school have toilets?',
     'AW': 'if no, where do children go to defecate?',
     'AX': 'if no, where do children go to defecate? other',
     'AY': 'what type of toilets are being used by the school? (please choose all appropriate)',
     'AZ': 'what type of toilets are being used by the school? (please choose all appropriate) other',
     'BA': 'of these, which is the main toilet that is used by the school?',
     'BB': 'of these, which is the main toilet that is used by the school? other',
     'BC': 'if pour flush or flush toilet, where does the water come from?',
     'BD': 'if pour flush or flush toilet, where does the water come from? other',
     'BE': 'which if the toilet type do students use the most?',
     'BF': 'which if the toilet type do students use the most? other',
     'BG': 'if yes, are the seperately marked for boys and girls?',
     'BH': 'if no, how many toilets are available at the school?',
     'BI': 'please take a picture of the toilet facilities?',
     'BJ': 'if yes, how many toilets are available for girls?',
     'BK': 'please take a picture of the girls toilets?',
     'BL': 'if yes, many toilets are available for boys?',
     'BM': 'please take a picture of the boys toilets?',
     'BN': 'please take a photo of the flush toilet?',
     'BO': 'please take a photo of the pour flush toilet?',
     'BP': 'please take a photo of the pit toilet with slab?',
     'BQ': 'please take a photo of the pit toilet without slab?',
     'BR': 'please take a photo of the hanging toilet?',
     'BS': 'please take a photo of the bucket toilet?',
     'BT': 'please take a photo of the compost toilet?',
     'BU': 'where are the toilets located?',
     'BV': 'are the toilets accessible by all students including small children and children with limited mobility?',
     'BW': 'please take a photo of the toilets that are accessible to children with limited mobility?',
     'BX': 'please take a photo of the toilets that are accessible to small children?',
     'BY': 'are the toilets clean on the day of the visit?',
     'BZ': 'are the toilets clean on the day of the visit?',
     'CA': 'how many of the boys toilets are clean on the day of the visit?',
     'CB': 'how many of the girls toilets are clean on the day of the visit?',
     'CC': 'how many of the toilets are functional on the day of the visit?',
     'CD': 'how many boys toilets are functional on the day of the visit?',
     'CE': 'how many girls toilets are functional on the day of the visit?',
     'CF': 'are there hand washing facilities at the school?',
     'CG': 'if yes, please take a photo of the hand washing facility?',
     'CH': 'if yes, what type of facility is there?',
     'CI': 'if yes, what type of facility is there? other',
     'CJ': 'if yes, where is the hand washing facility located?',
     'CK': 'if yes, where is the hand washing facility located? other',
     'CL': 'are both soap and water available at the hand washing facility?',
     'CM': 'where does the water for the hand washing facility come from?',
     'CN': 'where does the water for the hand washing facility come from? other',
     'CO': 'are the hand washing facilities accessible to all students including small children and those with limited mobility?',
     'CP': 'do students wash their hands in group daily hand washing activities?',
     'CQ': 'do students wash their hands in group daily hand washing activities? other',
     'CR': 'does the school have a changing area where girls can change and wash safely (private and secure, door and lock and hangers)',
     'CS': 'does the school have parent/teachers meeting?',
     'CT': 'does the school keep evidence of the parent/teacher meetings? (log books/minutes of meeting)',
     'CU': 'does the school have student wash clubs?',
     'CV': 'does the school curriculum include hygiene topics? (check all that applies)',
     'CW': 'does the school curriculum include hygiene topics? (check all that applies) other',
     'CX': 'if yes, please take photo of page that contains the hand washing topic?',
     'CY': 'if yes, please take photo of page that contains the adolescent health - talking about girls periods?',
     'CZ': 'is there a school action plan or any plan?',
     'DA': 'if yes, please take a photo of the document?',
     'DB': 'does the plan include wash (repair, maintenance of toilets, water, soap)?',
     'DC': 'if yes, please take a photo of the page that contains the wash aspects?',
     'DD': 'is there a cleaning schedule for the toilet facilities?',
     'DE': 'if yes, please take a photo of the cleaning schedule?',
     'DF': 'if yes, who cleans the toilets?',
     'DG': 'if yes, who cleans the toilets? other',
     'DH': 'if yes, when does the cleaning happen?',
     'DI': 'if yes, when does the cleaning happen? other',
     'DJ': 'is there lighting, fan and computers at school? (check all that applies)',
     'DK': 'please take a photo of the lighting?',
     'DL': 'how many classrooms have proper lighting?',
     'DM': 'please take a photo of the fan?',
     'DN': 'how many classrooms have fans?',
     'DO': 'please take a photo of the computer?',
     'DP': 'how many classrooms have computers?',
     'DQ': 'is there lighting, fan and computers at staff houses? (check all that applies)',
     'DR': 'please take a photo of the lighting?',
     'DS': 'please take a photo of the fan?',
     'DT': 'please take a photo of the computer?',
     'DU': 'does the school receive government grants annually?',
     'DV': 'if yes, how much money does the schools receive from the government annually?',
     'DW': 'how much money has been spent so far this year (2017) on cleaning, repairing, and making water and soap available at school?',
     'DX': 'how much did you spend last year (2016) on operating, repairing and maintaining toilets, water supply supply and hand washing facilities?',
     'DY': 'did the school get any support from the community?',
     'DZ': 'if yes, what kind of support was received from the community?',
     'EA': 'if yes, what kind of support was received from the community? other',
     'EB': 'does the school have a point of contact at the provincial education authority level?',
     'EC': 'if yes, please provide the name of the contact person?',
     'ED': 'if yes, does the school reach out to the contact person?',
     'EE': 'if yes, does the school reach out to the contact person? other',
     'EF': 'if yes, when was the last time the school reached out?',
     'EG': 'does the school keep a log book of problems with the school such as no toilets, no water, no lights?',
     'EH': 'if yes, please take a photo of the log book?',
     'EI': 'do teachers receive training/workshops?',
     'EJ': 'if yes, who provides the training/workshops?',
     'EK': 'if yes, does the training include the following? (tick all that applies)',
     'EL': 'if yes, does the training include the following? (tick all that applies) other',
     'EM': 'if yes, how often is the training?',
     'EN': 'if yes, how often is the training? other',
     'EO': 'when was the last training conducted?',
     'EP': 'when was the last training conducted? other',
     'EQ': 'have you observed any classroom teaching in the last month?',
     'ER': 'if yes, how many times?',
     'ES': 'are you currently doing any school based professional development with your teachers?',
     'ET': 'if yes, are you using the sittsi  (school based in-service teacher training in solomon islands) module for the professional development?',
     'EU': 'latitude',
     'EV': 'longitude',
     'EW': 'elevation',
     'EX': 'province',
     'EY': 'proportion of schools with basic drinking water from an improved source available at school',
     'EZ': 'primary water source (improved or not)',
     'FA': 'functional toilet',
     'FB': 'single-sex basic sanitation toilet',
     'FC': 'is the sanitation improved?',
     'FD': 'accessibility of sanitation source to students with limited mobility',
     'FE': 'handwashing facilities',
     'YR': 'year'}



# Export

## SQL Lite


```python
df.to_sql("databases", con=engine, if_exists='replace')
```

## Database CSV


```python
df.to_csv("databases_clean.csv",index=False)
```

## Json Config


```python
with open('config.json', 'w') as fp:
    json.dump(json_indicators, fp)
```
