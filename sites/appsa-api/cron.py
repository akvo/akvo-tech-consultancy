import requests
import os
import pandas as pd
import bs4
from datetime import datetime

URL = 'http://rsr.akvo.org/rest/v1/'
#PROJECT_ID = '7924'
#PROJECT_TYPE = 'child'
PROJECT_ID = '7950'
#PROJECT_ID = '7282'
PROJECT_TYPE = 'parent'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'

headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}

html_cache= "./cache/" + PROJECT_TYPE + "_" + PROJECT_ID + ".html"
html_template = "./templates/" + PROJECT_TYPE + "_" + PROJECT_ID + ".html"

def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' Fetching - ' + uri)
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

related_project = get_response('related_project','related_project',PROJECT_ID)
results_framework_list = list(pd.DataFrame(related_project['results'])['project'])

all_results_framework = []
def trace_all_childrens(project_id):
    related = get_response('related_project','related_project',project_id)
    if len(related['results']) > 0:
        for result in related['results']:
            all_results_framework.append(result)
            trace_all_childrens(result['project'])
    else:
        return all_results_framework

def trace_onechildren():
    results_framework = []
    for i, rf in enumerate(results_framework_list):
        result_framework = get_response('results_framework','project',rf)['results']
        if i == 0:
            results_framework = result_framework
        else:
            for res in result_framework:
                results_framework.append(res)
    return results_framework

results_framework = []
def no_trace():
    results_framework = get_response('results_framework','project',PROJECT_ID)['results']
    return results_framework

if PROJECT_TYPE == 'child':
    results_framework = no_trace()
if PROJECT_TYPE == 'parent':
    results_framework = trace_onechildren()

results_framework = pd.DataFrame(results_framework)
results_framework['child_projects'] = results_framework['child_projects'].apply(get_sibling_id)
results_framework = results_framework.to_dict('records')

indicators = []
periods = []
dimension_names = []
dimension_values = []
data_disaggregations = []
for result_framework in results_framework:
    rf_id = {'result':result_framework['id']}
    rf_project = {'project':result_framework['project_title']}
    rf_title = {'project_title':result_framework['title']}
    for indicator in result_framework['indicators']:
        indicator_id = indicator['id']
        for period in indicator['periods']:
            is_yearly = get_report_type(period['period_start'],period['period_end'])
            period.update(rf_title)
            period.update(rf_project)
            period.update(is_yearly)
            period.update(rf_id)
            period.update({'indicator':indicator_id})
            periods.append(period)
            for data in period['data']:
                if len(data) > 0:
                    period_id = data['period']
                    for disaggregations in data['disaggregations']:
                        disaggregations.update({'data_id': data['id']})
                        disaggregations.update({'period_id': data['period']})
                        data_disaggregations.append(disaggregations)
        del indicator['periods']
        for dimension_name in indicator['dimension_names']:
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

dimension_values = pd.DataFrame(dimension_values).groupby(['id']).first().reset_index()
data_disaggregations = pd.DataFrame(data_disaggregations).merge(dimension_values, how='inner', left_on='dimension_value', right_on='id')
data_disaggregations = data_disaggregations.rename(columns={
    'value_x':'aggr_value',
    'id_y':'id',
    'id_x':'data_id'
})


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
    'dimension_values':dimension_values,
    'dimension_data':data_disaggregations
}

d_indicators = pd.DataFrame(response['indicators'])
d_periods = pd.DataFrame(response['periods'])
d_periods['period_time'] = d_periods['period_start'] + ' - ' + d_periods['period_end']
d_periods = d_periods.groupby(['id',
                               'project',
                               'project_title',
                               'is_yearly',
                               'indicator',
                               'percent_accomplishment',
                               'period_time',
                               'target_value',
                               'actual_value']).size().to_frame('period_total').reset_index()

d_periods = d_periods.merge(d_indicators,
                            how='inner',
                            left_on='indicator',
                            right_on='id').groupby(['id_x',
                                                    'id_y',
                                                    'project',
                                                    'project_title',
                                                    'title',
                                                    'period_time',
                                                    'description',
                                                    'indicator',
                                                    'target_value',
                                                    'percent_accomplishment',
                                                    'actual_value']).size().to_frame('total').reset_index()

d_periods = d_periods.drop(columns='id_y').rename(columns={'id_x':'id'})

d_names = pd.DataFrame(response['dimension_names'])
d_names = d_names.rename(columns={'name':'disaggregation_type'})
d_results = pd.DataFrame(response['results_framework'])
d_names = d_names.merge(d_periods, how='inner', left_on='indicator', right_on='indicator')
d_data = pd.DataFrame(response['dimension_data']).drop(['result','value_y','has_commodity','has_country'], axis=1)
d_names = d_names[['id_y',
                   'project_y',
                   'project_title',
                   'indicator',
                   'title',
                   'description',
                   'disaggregation_type',
                   'period_time',
                   'target_value',
                   'actual_value',
                   'percent_accomplishment'
                  ]].rename(columns={
    'id_y':'period_id',
    'project_y':'project'
})
d_data = d_names.merge(d_data, how='inner', left_on='period_id',right_on='period_id')
d_data = d_data[[
    'project',
    'project_title',
    'title',
    'description',
    'indicator',
    'disaggregation_type',
    'period_time',
    'target_value',
    'actual_value',
    'percent_accomplishment',
    'commodity',
    'country',
    'aggr_value'
]].rename(columns={'commodity':'dimension'}).sort_index()

d_data = d_data.groupby([
    'project_title',
    'title',
    'description',
    'indicator',
    'disaggregation_type',
    'period_time',
    'target_value',
    'actual_value',
    'percent_accomplishment',
    'dimension',
    'country',
    'project',
    'aggr_value',
]).first()


reports = d_data.reset_index()
reports['country'] = reports.apply(lambda x: x['project'].replace('APPSA ','') if x['country'] == '' else x['country'], axis=1)
reports = reports.drop(columns=['project','percent_accomplishment'])
reports[['target_value','actual_value','aggr_value']] = reports[['target_value','actual_value','aggr_value']].astype(float)
reports['disaggregation_type'] = ' + ' + reports['disaggregation_type']
reports['dimension'] = ' • ' + reports['dimension']

project = reports.drop(columns='indicator').groupby(['project_title','title','period_time','country']).sum().reset_index()
project = project.groupby(['title','country']).sum().unstack('country')
project['disaggregation_type'] = ''
project.set_index('disaggregation_type', append=True, inplace=True)

disaggregation = reports.drop(columns=['indicator','dimension']).groupby(['project_title','title','disaggregation_type','period_time','country']).sum().reset_index()
disaggregation = disaggregation.groupby(['title','disaggregation_type','country']).sum().unstack('country')
project = pd.concat([project,disaggregation]).sort_index(axis=1).sort_index()

reports.drop(columns=['indicator','dimension'])

project['dimension'] = ''
project.set_index('dimension', append=True, inplace=True)

dimension = reports.drop(columns=['indicator']).groupby(['project_title','title','disaggregation_type','period_time','dimension','country']).sum().reset_index()
dimension = dimension.groupby(['title','disaggregation_type','dimension','country']).sum().unstack('country')

project = pd.concat([dimension,project]).sort_index(axis=1).sort_index()
project = project.astype(float).fillna(0)
project.to_html(html_cache)

print("INIT EDIT TABLE")
with open(html_cache) as htm:
    html = htm.read()
    soup = bs4.BeautifulSoup(html, "html.parser")

head = soup.new_tag("head")
soup.html.append(head)

soup.find('table')['border'] = 0
soup.find('table')['class'] = "table"

def remove_all_attrs_except(soup):
    whitelist = ['border','table','html','head']
    blacklist = ['title','disaggregation_type','dimension']
    header = ['actual_value','aggr_value','target_value']
    country = ['Malawi','Zambia','Mozambique']
    for tag in soup.find_all(True):
        if tag.name not in whitelist:
            tag.attrs = {}
            if tag.text in blacklist:
                tag.decompose()
        if tag.name == 'th':
            if '•' in tag.text:
                tag['style']='padding-left:50'
            if '+' in tag.text:
                tag['style']='padding-left:30'
        if tag.text == '':
            tag.decompose()
        if tag.text == 'country':
            new_head = soup.new_tag("th")
            tag = new_head
        if tag.text in header:
            tag['colspan'] = 3
            tag['class'] = 'text-center'
        if tag.text in country:
            tag['class'] = 'text-center'
        if tag.text == "actual_value":
            tag.insert_before(soup.new_tag("th"))
        try:
            float(tag.text)
            tag['class'] = 'text-right'
        except:
            pass
    return soup

remove_all_attrs_except(soup)
jquery = soup.new_tag("script",
                   src="https://code.jquery.com/jquery-3.3.1.js",
                   )
datatables = soup.new_tag("script",
                   src="https://cdn.datatables.net/1.10.19/js/jquery.dataTables.min.js",
                   )
css = soup.new_tag("link",
                   rel="stylesheet",
                   href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
                   integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
                   crossorigin="anonymous")
soup.html.append(css)
soup.html.append(jquery)
soup.html.append(datatables)

with open(html_template, "w") as outf:
    outf.write(str(soup))
