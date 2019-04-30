import pandas as pd
import string
import numpy as np
from sqlalchemy import create_engine
import json

# Import Database

engine = create_engine('sqlite:///databases.db')
df = pd.read_excel("sig-with-new-gps-aligned_v3.xlsx")
df_old = pd.read_excel("DATA_CLEANING-24520921-aligned.xlsx",skiprows=1)

# Cleaning

numerics = ['int16', 'int32', 'int64', 'float16', 'float32', 'float64']
df_num = df.select_dtypes(include=numerics)
df_num = df_num.drop(columns=list(df_num.columns[[-1,-2,-3,-4]]), axis=1)
df_num = df_num.fillna(0.0).astype(np.int32)
df[list(df_num)] = df_num
df['SubmissionDate'] = df['SubmissionDate'].apply(lambda x:x.replace(' CEST','').replace(' CET',''))
df['SubmissionDate'] = pd.to_datetime(df['SubmissionDate'], format='%d-%m-%Y %H:%M:%S')

# Create Indicators

indicators = list(df)
rep_indicators = [(lambda x: x.lower().replace('GEOLON',''))(x) for x in list(df)]
keyname = lambda x,y: {a:y[b] for b, a in enumerate(x)}
hdr = lambda a: [x.lower() if x.find("|") == -1 else x.split('|')[1].lower().replace("--other--"," other") for x in a]
header = hdr(list(df_old))
chars =list(string.ascii_uppercase)
chars_col = chars + [x+y for x in chars for y in chars]
index = chars_col[:len(list(df))]
json_indicators = keyname(index, header)

# Transform Indicators

df.columns = index

# Generate Timeseries

df['YEAR'] = df['E'].apply(lambda x: x.strftime('%Y'))
json_indicators.update({'YEAR':'Year'})

# Export

df.to_csv("databases_clean.csv",index=False)
df.to_sql("databases", con=engine, if_exists='replace')
with open('config.json', 'w') as fp:
    json.dump(json_indicators, fp)

