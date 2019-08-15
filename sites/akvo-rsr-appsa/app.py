import requests
import os
import pandas as pd
from datetime import datetime
from flask import Flask, jsonify

app = Flask(__name__)

URL = 'https://rsr.akvo.org/rest/v1/'
PROJECT_ID = '2602'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'

headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}

def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' Fetching - ' + uri)
    data = requests.get(uri, headers=headers)
    data = data.json()
    return data

def get_time():
    now = datetime.now().time().strftime("%H:%M:%S")
    return now

def get_children_id(x):
    for k,v in x.items():
        return k

def get_children_title(x):
    for k,v in x.items():
        return v

@app.route('/api', methods=['GET'])
def api():
    results_indicator = get_response('results_framework','project',PROJECT_ID)['results']
    indicators = [{'id':x['id'],'title':x['title']} for x in results_indicator]
    results_indicator_df = pd.DataFrame(results_indicator)
    results_indicator_df['child_id'] = results_indicator_df['child_projects'].apply(get_children_id)
    results_indicator_df['child_title'] = results_indicator_df['child_projects'].apply(get_children_title)
    results_indicator = results_indicator_df.to_dict('records')
    indicator_periods = []
    for result in results_indicator:
        for indicator in result['indicators']:
            for period in indicator['periods']:
                period.update({'project_id':result['project']})
                period.update({'project_name':result['project_title']})
                period.update({'project_title':result['title']})
                period.update({'parent_project':result['parent_project']})
                period.update({'parent_result':result['parent_result']})
                period.update({'child_project_id':result['child_id']})
                period.update({'child_project_title':result['child_title']})
                period.update({'dimensions':indicator['dimension_names']})
                indicator_periods.append(period)
    indicator_periods = pd.DataFrame(indicator_periods)
    indicator_periods[['period_end_year','period_end_month','period_end_date']] = indicator_periods['period_end'].str.split('-', expand=True)
    indicator_periods[['period_start_year','period_start_month','period_start_date']] = indicator_periods['period_start'].str.split('-', expand=True)
    period_start = indicator_periods.groupby('period_start_year').size().to_frame('size').reset_index()
    period_end = indicator_periods.groupby('period_end_year').size().to_frame('size').reset_index()
    period_start.rename(columns={'period_start_year':'start_year'})
    period_end.rename(columns={'period_end_year':'end_year'})
    period_start = period_start.to_dict('records')
    period_end = period_end.to_dict('records')
    indicator_periods = indicator_periods.to_dict('records')
    api = {
        'dd_indicators': indicators,
        'dd_start': period_start,
        'dd_end': period_end,
        'dd_region': ['Malawi', 'Zambia', 'Mozambique'],
        'indicator_periods': indicator_periods,
    }
    return jsonify(api)

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True, port=5000)
