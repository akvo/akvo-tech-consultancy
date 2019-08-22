## Init Dependencies

import requests
import os
import pandas as pd
import json
from datetime import datetime
from flask import Flask, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

### Workspace Setup

pd.options.display.max_rows = 999
pd.options.display.max_columns = 999

## Set Static Variables

URL = 'http://192.168.1.134/rest/v1/'
PROJECT_ID = '7283'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'
ENDPOINTS= ['results_framework']

## Set Authentication

headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}

## Helper Functions

def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' :: FETCH RSR - ' + uri)
    data = requests.get(uri, headers=headers)
    data = data.json()
    return data

def get_time():
    now = datetime.now().time().strftime("%H:%M:%S")
    return now


def get_sibling_id(x):
    for k,v in x.items():
        return k

def get_report_type(ps,pe):
    rt = {'is_yearly':False}
    psm = ps.split('-')[1]
    pem = pe.split('-')[1]
    if psm == '01' and pem == '12':
        rt = {'is_yearly':True}
    if psm == '01' and pem == '01':
        rt = {'is_yearly':True}
    return rt

def get_dimension_country(dv):
    dp = dv['value'].split(' - ')
    dv = {}
    if dp[0].lower() in ['zambia','malawi','mozambique']:
        dv.update({
            'commodity':'',
            'country':dp[0],
            'has_commodity':False,
            'has_country':True
        })
    else:
        dv.update({
            'commodity':dp[0],
            'country':'',
            'has_commodity':False,
            'has_country':True
        })
    if len(dp) == 2:
        dv.update({
            'commodity':dp[0],
            'country':dp[1],
            'has_commodity':True,
            'has_country':True
        })
    return dv

def readcache(filename):
    print(get_time() + ' :: READING CACHE - ' + filename)
    filename = './cache/' + filename + '.json'
    with open(filename, 'r') as f:
        data = json.load(f)
    return data

## WEBAPP

## API I: Result Framework

def results_framwork_api():
    results_framework = get_response('results_framework','project',PROJECT_ID)['results']

    indicators = []
    periods = []
    dimension_names = []
    dimension_values = []

    print(get_time() + ' :: FOUND ' + str(len(results_framework)) + ' Results')
    for result_framework in results_framework:
        rf_id = {'result':result_framework['id']}

        print(get_time() + ' :: FOUND ' + str(len(result_framework['indicators'])) + ' Indicators')
        for indicator in result_framework['indicators']:
            indicator_id = indicator['id']

            print(get_time() + ' :: FOUND ' + str(len(indicator['periods'])) + ' Periods')
            for period in indicator['periods']:
                is_yearly = get_report_type(period['period_start'],period['period_end'])
                period.update(is_yearly)
                period.update(rf_id)
                period.update({'indicator':indicator_id})
                periods.append(period)
            del indicator['periods']

            print(get_time() + ' :: FOUND ' + str(len(indicator['dimension_names'])) + ' Dimension Names')
            for dimension_name in indicator['dimension_names']:

                print(get_time() + ' :: FOUND ' + str(len(dimension_name['values'])) + ' Dimension Values')
                for dimension_value in dimension_name['values']:
                    dimension_value.update(rf_id)
                    dimension_update = get_dimension_country(dimension_value)
                    dimension_value.update(dimension_update)
                    dimension_values.append(dimension_value)
                del dimension_name['values']
                dimension_name.update(rf_id)
                dimension_name.update({'indicator':indicator_id})
                dimension_names.append(dimension_name)
            del indicator['dimension_names']
            indicators.append(indicator)

    ## Update Results Framework
    print(get_time() + ' :: GENERATING NEW CACHE /cache/results_framework.json')

    periods_df = pd.DataFrame(periods)
    periods_df = periods_df.groupby(['is_yearly','result']).size().to_frame('size').reset_index().to_dict('records')

    reports_annual = []
    reports_semester = []
    reports_both = []

    for period_df in periods_df:
        if period_df['is_yearly']:
            reports_annual.append(period_df['result'])
        else:
            reports_semester.append(period_df['result'])
    for y in reports_annual:
        for s in reports_semester:
            if y == s:
                reports_both.append(y)
    for m in reports_both:
        reports_annual.remove(m)
        reports_semester.remove(m)

    results_framework_new = []
    for rf in results_framework:
        report_type = 'both'
        if rf['id'] in reports_annual:
            report_type = 'annual'
        if rf['id'] in reports_semester:
            report_type = 'semeseter'
        rf.update({'report_type':report_type})
        try:
            child_project = get_sibling_id(rf['child_projects'])
            rf.update({'child_projects': child_project})
        except:
            rf.update({'child_projects': None})
        try:
            parent_project = get_sibling_id(rf['parent_project'])
            rf.update({'parent_project': parent_project})
        except:
            rf.update({'parent_project': None})
        del rf['indicators']
        results_framework_new.append(rf)

    response = {
        'results_framework':results_framework_new,
        'indicators':indicators,
        'periods':periods,
        'dimension_names':dimension_names,
        'dimension_values':dimension_values
    }
    with open('./cache/results_framework.json', 'w') as outfile:
        json.dump(response, outfile)
    return response;

@app.route('/api/<trigger>/<endpoint>', methods=['GET'])
def api(trigger, endpoint):
    print(get_time() + ' :: ACCESS - ' + endpoint)
    if not endpoint in ENDPOINTS:
        return Response("{'message':'enpoint has no contents'}",
                status=204,
                mimetype='application/json')
    update = False
    if trigger == 'update':
        update = True
    if not os.path.exists('./cache/' + endpoint + '.json'):
        update = True
    if update:
        results_framwork_api()
    response = readcache(endpoint)
    return jsonify(response)

if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host= '0.0.0.0',debug=True, port=5000)
