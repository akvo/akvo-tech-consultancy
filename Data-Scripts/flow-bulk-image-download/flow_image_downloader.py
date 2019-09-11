import pandas as pd
import urllib.request

FOLDER_PATH = ''
DATA_CLEANING = ''
IMAGE_QUESTION = '111340928|Take a picture of the house'
FILENAME_FORMAT = ['Display Name','Submission Date', IMAGE_QUESTION]

df = pd.read_excel(DATA_CLEANING)
df = df[FILENAME_FORMAT]
df['_filename'] = df.apply(lambda x: '_'.join(x[FILENAME_FORMAT]), axis=1)
df['filename'] = df['_filename'].apply(lambda x:x.replace(' ','_').replace('_UTC','') + '.jpg')
df = df[[IMAGE_QUESTION,'filename']].rename(columns={IMAGE_QUESTION:'images'})
results = df.to_dict('records')
for result in results:
    urllib.request.urlretrieve(result['images'], FOLDER_PATH + result['filename'])
