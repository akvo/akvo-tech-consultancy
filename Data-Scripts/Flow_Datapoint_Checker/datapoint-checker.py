import pandas as pd
from datetime import datetime

pd.set_option('mode.chained_assignment', None)

INPUT_FILE = 'UI numbers for Nikki.xlsx'
DATA_CLEANING_FILE = 'DATA_CLEANING-87691144.xlsx'
DISPLAY_NAME = False
OUTPUT_FORMAT = 'csv' # csv or excel
OUTPUT_SORT_BY = 'device' # date or device
OUTPUT_NAME = '87691144'

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

status = getDataFrame(INPUT_FILE)
data = pd.read_excel(DATA_CLEANING_FILE, skiprows=1)
data = data[list(data)[0:8]]
status.columns = map(str.lower, status.columns)
data.columns = map(str.lower, data.columns)
result_columns = list(set(list(status) + list(data)))
id_col = status[['identifier']]
merged = data.merge(id_col, on='identifier', how='inner')
merged = merged.merge(status, on='identifier', how='outer')
result = merged.sort_values(by=[OUTPUT_SORT_BY]).fillna('-')
result['status'] = result['submitter'].apply(lambda x: 'Not Found' if x == '-' else 'Success')

if DISPLAY_NAME == False:
    result = result.drop(columns=['display name'])

available = result[result['submitter'] != '-']
available['submission date'] = pd.to_datetime(available['submission date'], format='%d-%m-%Y %H:%M:%S UTC')
available = available.sort_values(by=[OUTPUT_SORT_BY])
print(str(len(available)) + " rows found")

not_found = result[result['submitter'] == '-'][list(status)]
print(str(len(not_found)) + " rows is not found")

nowdate = datetime.now().strftime("_%Y-%m-%d_%H-%M-%S_")
result = not_found.append(available).fillna('-')
result = result[list(available)]

if OUTPUT_SORT_BY == 'device':
    result = result.sort_values(by=[OUTPUT_SORT_BY])

if OUTPUT_FORMAT.lower() == 'excel':
    result.to_excel('1.ALL-RESULT'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
    available.to_excel('2.AVAILABLE'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
    not_found.to_excel('3.NOT-FOUND'+ nowdate + OUTPUT_NAME +'.xlsx', index=False)
else:
    result.to_csv('1.ALL-RESULT'+ nowdate + OUTPUT_NAME +'.csv', index=False)
    available.to_csv('2.AVAILABLE'+ nowdate + OUTPUT_NAME +'.csv', index=False)
    not_found.to_csv('3.NOT-FOUND'+ nowdate + OUTPUT_NAME +'.csv', index=False)

