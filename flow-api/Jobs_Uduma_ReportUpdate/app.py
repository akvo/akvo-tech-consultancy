import os
import pandas as pd
import re
from sqlalchemy import create_engine, inspect, MetaData, Table, Column, Integer, Float, Text
from sqlalchemy.orm import sessionmaker
from geoalchemy2 import Geography, WKTElement
from FlowHandler import FlowHandler
from Akvo import Flow

PSQL_USER = os.environ['PSQL_USER']
PSQL_PWD = os.environ['PSQL_PWD']
PSQL_DB = os.environ['PSQL_DB']

instanceURI = 'seap'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI
surveyID = '285250912'
surveyID = '312920912'

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

engine = create_engine("postgresql://{}:{}@localhost/{}".format(PSQL_USER, PSQL_PWD, PSQL_DB))
connection = engine.connect()
meta = MetaData(engine)

Session = sessionmaker()
Session.configure(bind=engine)
session = Session()

def generate_column_type(ctype, cname):
    if ctype == 'GEO':
        return Column(cname, Geography(geometry_type='POINT', srid=4326))
    if ctype == 'NUMBER':
        return Column(cname, Float(), nullable=True)
    return Column(cname, Text(), nullable=True)

def format_column_name(name, identifier):
    name = regex.sub('', name).lower().replace(' ','_')
    return '{}_{}'.format(name,identifier)

def dataframe_difference(df1, df2):
    comparison_df = df1.merge(df2,
                              indicator=True,
                              how='outer')
    return comparison_df[comparison_df['_merge'] != 'both']

surveyForm = Flow.getResponse('{}/surveys/{}'.format(requestURI, surveyID))
formDetails = surveyForm['forms'][0]
formInstancesUrl = formDetails['formInstancesUrl']
formInstances = Flow.getResponse(formInstancesUrl)
formInstancesData = formInstances['formInstances']
questionGroups = formDetails['questionGroups']

while 'nextPageUrl' in formInstances:
    print(formInstances['nextPageUrl'])
    nextPageData = Flow.getResponse(formInstances['nextPageUrl'])
    formInstancesData += nextPageData['formInstances']
    formInstances = nextPageData

PSQL_TABLE = formDetails['name'].lower().replace(' ','_')
Table(PSQL_TABLE,meta,
          Column('id',Integer, primary_key=True, autoincrement=True),
          Column('datapoint_id',Integer))

try:
    columnInspector = inspect(engine).get_columns(PSQL_TABLE)
    colExisted = [x['name'] for x in columnInspector]
except:
    colExisted = []

questions = []
for group in questionGroups:
    data = {'group_id':group['id'], 'group_name': group['name']}
    for q in group['questions']:
        regex = re.compile('[,\.!?]')
        q['column_name'] = format_column_name(q['name'],q['id'])
        q['query'] = generate_column_type(q['type'],q['column_name'])
        q['create'] = not any(q['column_name'] in c for c in colExisted)
        q.update(data)
        questions.append(q)
questions = pd.DataFrame(questions)
create_columns = questions[['create','query']].to_dict('records')

for col in create_columns:
    Table(PSQL_TABLE, meta, col['query'], extend_existing=True)
meta.create_all()

datapoints = []
for datapoint in formInstancesData:
    dataupdate = {'datapoint_id':int(datapoint['dataPointId'])}
    for group in questionGroups:
        gid = group['id']
        for response in datapoint['responses'][gid]:
            for q in group['questions']:
                cname = format_column_name(q['name'], q['id'])
                try:
                    answer = FlowHandler(response,q['id'],q['type'])
                    if q['type'] == 'GEO':
                        answer = WKTElement('POINT({} {})'.format(answer[1], answer[0]))
                        print(answer)
                except:
                    answer = None
                dataupdate.update({cname:answer})
    datapoints.append(dataupdate)

new_data = pd.DataFrame(datapoints)
try:
    rows = connection.execute('SELECT * FROM {}'.format(PSQL_TABLE))
    old_data = [{key: value for (key, value) in row.items()} for row in rows]
    old_data = pd.DataFrame(old_data)
    old_data = old_data.drop(columns=['id'])
    new_data = old_data.merge(new_data, indicator=True, how='outer')
    new_data = new_data[new_data['_merge'] != 'both']
except:
    pass

new_data = new_data.to_dict('records')
table_update = Table(PSQL_TABLE, meta)
connection.execute(table_update.insert(), new_data)
