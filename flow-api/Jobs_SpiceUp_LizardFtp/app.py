from datetime import datetime
import time
import numpy as np
from Akvo import Flow
from FlowHandler import FlowHandler
import pandas as pd
import shapefile as sf
import geojson

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

instanceURI = 'spiceup'
requestURI = 'https://api.akvo.org/flow/orgs/' + instanceURI

FarmDetails = Flow.getResponse(requestURI + '/surveys/245360436')
FarmerProfiles = Flow.getResponse(requestURI + '/surveys/249380481')
start_time = time.time()
date_format = '%Y-%m-%dT%H:%M:%SZ'

def checkTime(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent
def fileDate():
    return datetime.now().strftime("_%Y_%m_%d_%H%M")

questions = lambda x : [{'id':a['id'],'name':a['name'],'questions':details(a['questions'])} for a in x]
details = lambda x : [{'id':a['id'],'name':a['name'].replace(' ','_'),'type':a['type']} for a in x]

def getAll(url, dataPoints):
    dataPoints = dataPoints
    data = Flow.getResponse(url)
    formInstances = data.get('formInstances')
    for dataPoint in formInstances:
        dataPoints.append(dataPoint)
    try:
        print(checkTime(time.time()) + ' GET DATA FROM[' + url + ']')
        url = data.get('nextPageUrl')
        getAll(url, dataPoints)
    except:
        print(checkTime(time.time()) + ' DOWNLOAD COMPLETE')
    return dataPoints

def getData(surveyData):
    forms = surveyData.get('forms')
    allResponses = {}
    for form in forms:
        questionGroups = questions(form['questionGroups'])
        metas = pd.DataFrame(questionGroups)
        formURI = form['formInstancesUrl']
        allGroups = {}
        for index, questionGroup in enumerate(questionGroups):
            groupID = questionGroup['id']
            metadata = metas['questions'][index]
            dataPoints = getAll(formURI, [])
            output = pd.DataFrame(dataPoints)
            print(checkTime(time.time()) + ' TRANSFORMING')
            for qst in metadata:
                qName = qst['name'].replace('_',' ')
                qId = str(qst['id'])
                qType = qst['type']
                try:
                    output[qName] = output['responses'].apply(lambda x: FlowHandler(x[groupID],qId,qType))
                    if qType == 'GEO':
                        output[qName+'_lat'] = output[qName].apply(lambda x: x[0] if x is not None else x)
                        output[qName+'_long'] = output[qName].apply(lambda x: x[1] if x is not None else x)
                        output = output.drop([qName], axis=1)
                except:
                    pass
            try:
                output = output.drop(['responses'], axis=1)
            except:
                pass
            allGroups.update({questionGroup['name']:output.to_dict('records')})
        allResponses.update({form['name']:allGroups})
    return allResponses


FarmerProfilesData = getData(FarmerProfiles)
FarmDetailsData = getData(FarmDetails)
FarmDetailsData.update(FarmerProfilesData)

farmer_profiles = pd.DataFrame(FarmDetailsData['Farmer Profiles']['Profile']).replace({np.nan:None})
farm_plots = pd.DataFrame(FarmDetailsData['Farm Registration']['Farm Registration']).replace({np.nan:None})
farm_plots_excel = pd.read_excel('./data/DATA_CLEANING-235370382.xlsx',skiprows=[0])
farm_plots_excel = farm_plots_excel[['235420101|Plot Area','Identifier']].rename(columns={"235420101|Plot Area":"Plot Area"})

def ParseJson(data):
    data = data.replace("'",'"')
    import json
    j1 = json.loads(data)
    return j1

farm_plots_excel['Plot Area'] = farm_plots_excel['Plot Area'].replace({np.nan:None})
farm_plots_excel['Plot Area'] = farm_plots_excel['Plot Area'].apply(lambda x:None if x is None else ParseJson(x))
farm_plots = farm_plots.merge(farmer_profiles, right_on='identifier', left_on='Farmer Registration ID', suffixes=('_plot', '_profile'))
farm_plots = farm_plots.merge(farm_plots_excel,right_on='Identifier',left_on='identifier_plot', suffixes=('_x','_y'))
farm_plots['Plot Area'] = farm_plots['Plot Area_y'].replace({np.nan:None})
farm_plots = farm_plots[farm_plots.columns.drop(list(farm_plots.filter(regex='_profile')))]
farm_plots['Code'] = farm_plots['identifier_plot']
farm_plots['Submission Date'] = farm_plots['submissionDate_plot']
farm_plots = farm_plots[farm_plots.columns.drop(list(farm_plots.filter(regex='_plot')))]

def getCodeVal(s, i, d):
    if s is None:
        return d.split(':')[1]
    else:
        return d.split(s)[i].split(':')[1]
def getAddress(x):
    p_address = getCodeVal('|',3,x).title() + ', ' + getCodeVal('|',2,x).title() + ', '
    p_address += getCodeVal('|',1,x).title() + ', ' + getCodeVal('|',0,x).title()
    return p_address

farm_plots['Province'] = farm_plots['Farm Location'].apply(lambda x:x if x is None else getCodeVal('|',0,x))
farm_plots['District'] = farm_plots['Farm Location'].apply(lambda x:x if x is None else getCodeVal('|',1,x))
farm_plots['Subdistrict'] = farm_plots['Farm Location'].apply(lambda x:x if x is None else getCodeVal('|',2,x))
farm_plots['Village'] = farm_plots['Farm Location'].apply(lambda x:x if x is None else getCodeVal('|',3,x))
farm_plots['Farmer Address'] = farm_plots['Address'].apply(lambda x:x if x is None else getAddress(x))
farm_plots['Type of Farmer'] = farm_plots['Type of Farmer'].apply(lambda x:x if x is None else getCodeVal(None, 0, x))
farm_plots['Pole Type'] = farm_plots['Pole Type'].apply(lambda x:x if x is None else getCodeVal(None, 0, x))
farm_plots['Variety'] = farm_plots['Variety'].apply(lambda x:x if x is None else getCodeVal(None, 0, x))
farm_plots['Commodity'] = farm_plots['Commodity'].apply(lambda x:x if x is None else getCodeVal(None, 0, x))
farm_plots['Gender'] = farm_plots['Gender'].apply(lambda x:x if x is None else getCodeVal(None, 0, x))
farm_plots = farm_plots.rename(columns={"Name":"Farmer Name"})
farm_plots['LatLng'] = farm_plots[['Geolocation_lat','Geolocation_long']].apply(lambda x: None if x[0] is None else [x[0],x[1]], axis=1)
farm_plots['Plot Area'] = farm_plots['Plot Area'].apply(lambda x:None if x is None else x['features'][0]['geometry']['coordinates'][0][0])
farm_plots['Plot Area'] = farm_plots['Plot Area'].apply(lambda x:None if x is None else [x[1],x[0]])


selected_plots = farm_plots[['Code','Submission Date',
                         'Registration Number','Farmer Name',
                         'Province','District','Subdistrict','Village',
                         'Plant Date','Number of Plants','Pole Type',
                         'Variety','Commodity','Farmer Address',
                         'Plot Area']]

selected_plots = selected_plots.loc[selected_plots['Plot Area'].notnull()]
farm_dict = selected_plots.to_dict('records')

points = {"type": "FeatureCollection","features": []}
for idx, fp in enumerate(farm_dict):
    reg_no = None
    if fp["Registration Number"] is not None:
        reg_no = int(fp["Registration Number"])
    point = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": fp['Plot Area']},
        "properties": {
            "code": fp["Code"],
            "registration number": reg_no,
            "province": fp["Province"],
            "district": fp["District"],
            "subdistrict": fp["Subdistrict"],
            "village": fp["Village"],
        }
    }
    points["features"].append(point)

# WRITE GEOJSON

with open('./results/example.geojson', 'w') as geopoints:
    geojson.dump(points, geopoints)


# GENERATE SHAPEFILE

shp = sf.Writer('./results/example')
ini = open("./results/example.ini","w")
data = open("./results/example.csv","w")
params = ['Code','name','category','region']
subparams = ['Number of Plants','Pole Type','Variety','Commodity']

ini.write('[general]\n')
ini.write('asset_name = MeasuringStation\n')
ini.write('organisation = 790bd838241046dd93db1576a1727fde\n')
ini.write('\n\n')
ini.write('[columns]\n')

for param in params:
    if param == 'name':
        shp.field(param,'N')
    else:
        shp.field(param, 'C','100')
    ini.write(param.lower() + ' = ' + param + '\n')

ini.write('\n\n')
ini.write('[defaults]\n')
ini.write('category = Farms\n')
ini.write('station_type = 5\n')

for idx, fp in enumerate(farm_dict):
    reg_no = 0
    province = 'unknown'
    district = 'unknown'
    subdistrict = 'unknown'
    village = 'unknown'
    commodity = 'unknown'
    if fp['Registration Number'] is not None:
        reg_no = int(fp['Registration Number'])
    if fp['Province'] is not None:
        province = fp['Province']
    if fp['District'] is not None:
        district = fp['District']
    if fp['Subdistrict'] is not None:
        subdistrict = fp['Subdistrict']
    if fp['Village'] is not None:
        village = fp['Village']
    if fp['Commodity'] is not None:
        commodity = fp['Commodity']
        if fp['Variety'] is not None:
            commodity += '|' + fp['Variety']
    shp.point(fp['Plot Area'][0],fp['Plot Area'][1])
    shp.record(fp['Code'],reg_no, commodity , province+'|'+district+'|'+subdistrict+'|'+village)
    for subparam in subparams:
        if type(fp[subparam]) == float:
            fp[subparam] = int(fp[subparam])
        if fp[subparam] is not None:
            data.write(fp['Submission Date'] + ',')
            data.write('g4aw:'+subparam+',')
            data.write(str(fp[subparam])+',')
            data.write(fp['Code'])
            data.write('\n')
shp.close()
