
# coding: utf-8

# ## Init Dependencies

# In[1]:


import requests
import os
import pandas as pd
from datetime import datetime
import json


# ### Workspace Setup

# In[2]:


pd.options.display.max_rows = 999
pd.options.display.max_columns = 999


# ## Set Static Variables

# In[3]:


URL = 'http://rsr.akvo.org/rest/v1/'
#PROJECT_ID = '7924'
#PROJECT_TYPE = 'child'
PROJECT_ID = '7950'
#PROJECT_ID = '7282'
PROJECT_TYPE = 'parent'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'


# ## Set Authentication

# In[4]:


headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}


# ## Helper Functions

# In[5]:


def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' Fetching - ' + uri)
    data = requests.get(uri, headers=headers)
    data = data.json()
    return data


# In[6]:


def get_time():
    now = datetime.now().time().strftime("%H:%M:%S")
    return now


# In[7]:


def get_sibling_id(x):
    for k,v in x.items():
        return k


# In[8]:


def get_report_type(ps,pe):
    rt = {'is_yearly':False}
    psm = ps.split('-')[1]
    pem = pe.split('-')[1]
    if psm == '01' and pem == '12':
        rt = {'is_yearly':True}
    if psm == '01' and pem == '01':
        rt = {'is_yearly':True}
    return rt


# In[9]:


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


# ## Find Related Project

# In[10]:


related_project = get_response('related_project','related_project',PROJECT_ID)


# In[11]:


results_framework_list = list(pd.DataFrame(related_project['results'])['project'])


# ### Trace All Children (Alternative)

# In[12]:


all_results_framework = []
def trace_all_childrens(project_id):
    related = get_response('related_project','related_project',project_id)        
    if len(related['results']) > 0:
        for result in related['results']:
            all_results_framework.append(result)
            trace_childrens(result['project'])
    else:
        return all_results_framework


# ### Concat Results Frameworks (Alternative)

# In[13]:


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


# ### Only Parents

# In[14]:


results_framework = []
def no_trace():
    results_framework = get_response('results_framework','project',PROJECT_ID)['results']
    return results_framework


# ### Choose Trace Level

# In[15]:


if PROJECT_TYPE == 'child':
    results_framework = no_trace()
if PROJECT_TYPE == 'parent':
    results_framework = trace_onechildren()
#results_framework = trace_all_childrens(PROJECT_ID)


# ## Begin Transformations

# In[16]:


results_framework = pd.DataFrame(results_framework)


# ### Remove Project Without Childs

# In[17]:


results_framework['child_projects'] = results_framework['child_projects'].apply(get_sibling_id)


# In[18]:


#results_framework = results_framework[results_framework['child_projects'].notnull()]


# In[19]:


results_framework = results_framework.to_dict('records')


# In[20]:


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


# ### Joining Dimension Values with Data Disaggregations

# In[21]:


dimension_values = pd.DataFrame(dimension_values).groupby(['id']).first().reset_index()


# In[22]:


data_disaggregations = pd.DataFrame(data_disaggregations).merge(dimension_values, how='inner', left_on='dimension_value', right_on='id')


# In[23]:


data_disaggregations = data_disaggregations.rename(columns={
    'value_x':'aggr_value',
    'id_y':'id',
    'id_x':'data_id'
})


# ## Periods

# ### About Period

# - Has many Data
# - Belongs to Indicator
# - Data has Many Disaggregation
# 
# _Data Format_ :

# ### About Disaggregation Target

# - Specific Per-projects
# - Doesn't have any effect to children or parent projects
# - Only for verification of Actual Value
# - Belongs to Period
# - Has many dimension value

# ## Update Result Framework

# In[24]:


periods_df = pd.DataFrame(periods)
periods_df = periods_df.groupby(['is_yearly','result']).size().to_frame('size').reset_index().to_dict('records')


# In[25]:


reports_annual = []
reports_semester = []
reports_both = []


# In[26]:


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


# In[27]:


reports_both


# In[28]:


results_framework_new = []
for rf in results_framework:
    report_type = 'both'
    if rf['id'] in reports_annual:
        report_type = 'annual'
    if rf['id'] in reports_semester:
        report_type = 'semeseter'
    rf.update({'report_type':report_type})
    #try:
    #    child_project = get_sibling_id(rf['child_projects'])
    #    rf.update({'child_projects': child_project})
    #except:
    #    rf.update({'child_projects': None})
    try:
        parent_project = get_sibling_id(rf['parent_project'])
        rf.update({'parent_project': parent_project})
    except:
        rf.update({'parent_project': None})
    del rf['indicators']
    results_framework_new.append(rf)


# ### API Response

# In[29]:


response = {
    'results_framework':results_framework_new,
    'indicators':indicators,
    'periods':periods,
    'dimension_names':dimension_names,
    'dimension_values':dimension_values,
    'dimension_data':data_disaggregations
}


# In[30]:


d_indicators = pd.DataFrame(response['indicators'])


# In[31]:


d_periods = pd.DataFrame(response['periods'])


# In[32]:


d_periods['period_time'] = d_periods['period_start'] + ' - ' + d_periods['period_end']


# In[33]:


d_periods = d_periods.groupby(['id',
                               'project',
                               'project_title',
                               'is_yearly',
                               'indicator',
                               'percent_accomplishment',
                               'period_time',
                               'target_value',
                               'actual_value']).size().to_frame('period_total').reset_index()


# In[34]:


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


# In[35]:


d_periods = d_periods.drop(columns='id_y').rename(columns={'id_x':'id'})


# ## Output Schema

# In[36]:


d_names = pd.DataFrame(response['dimension_names'])
d_names = d_names.rename(columns={'name':'disaggregation_type'})


# In[37]:


d_results = pd.DataFrame(response['results_framework'])


# In[38]:


d_names = d_names.merge(d_periods, how='inner', left_on='indicator', right_on='indicator')


# ### Childs Aggregation

# In[39]:


d_data = pd.DataFrame(response['dimension_data']).drop(['result','value_y','has_commodity','has_country'], axis=1)


# In[40]:


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


# In[41]:


d_data = d_names.merge(d_data, how='inner', left_on='period_id',right_on='period_id')


# In[42]:


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


# In[43]:


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


# ## Reports Output

# ### Check Type of Project

# In[258]:


reports = d_data.reset_index()


# In[259]:


reports['country'] = reports.apply(lambda x: x['project'].replace('APPSA ','') if x['country'] == '' else x['country'], axis=1)


# In[260]:


reports = reports.drop(columns=['project','percent_accomplishment'])


# In[261]:


reports[['target_value','actual_value','aggr_value']] = reports[['target_value','actual_value','aggr_value']].astype(float)


# In[262]:


reports['disaggregation_type'] = ' + ' + reports['disaggregation_type']
reports['dimension'] = ' • ' + reports['dimension']


# In[263]:


pdo = reports.drop(columns='indicator').groupby(['project_title','title','period_time','country']).sum().reset_index()
pdo = pdo.groupby(['title','country']).sum().unstack('country')
pdo['disaggregation_type'] = ''
pdo.set_index('disaggregation_type', append=True, inplace=True)


# In[264]:


disaggregation = reports.drop(columns=['indicator','dimension']).groupby(['project_title','title','disaggregation_type','period_time','country']).sum().reset_index()
disaggregation = disaggregation.groupby(['title','disaggregation_type','country']).sum().unstack('country')
pdo = pd.concat([pdo,disaggregation]).sort_index(axis=1).sort_index()


# In[265]:


reports.drop(columns=['indicator','dimension'])


# In[266]:


pdo['dimension'] = ''
pdo.set_index('dimension', append=True, inplace=True)


# In[267]:


dimension = reports.drop(columns=['indicator']).groupby(['project_title','title','disaggregation_type','period_time','dimension','country']).sum().reset_index()
dimension = dimension.groupby(['title','disaggregation_type','dimension','country']).sum().unstack('country')


# In[268]:


pdo = pd.concat([dimension,pdo]).sort_index(axis=1).sort_index()


# In[269]:


pdo = pdo.astype(float).fillna(0)


# In[270]:


pdo.to_html('test.html')


# ## Beautify HTML

# In[278]:


import bs4


# In[279]:


with open("test.html") as htm:
    html = htm.read()
    soup = bs4.BeautifulSoup(html)


# In[280]:


soup.find('table')['border'] = 0
soup.find('table')['class'] = "table"


# In[281]:


def remove_all_attrs_except(soup):
    whitelist = ['border','table']
    blacklist = ['title','disaggregation_type','dimension']
    header = ['actual_value','aggr_value','target_value']
    country = ['Malawi','Zambia','Mozambique']
    for tag in soup.find_all(True):
        if tag.name not in whitelist:
            tag.attrs = {}
        if tag.name == 'th':
            if '•' in tag.text:
                tag['style']='padding-left:50'
            if '+' in tag.text:
                tag['style']='padding-left:30'
        if tag.text == '':
            tag.decompose()
        if tag.text in blacklist:
            tag.decompose()
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


# In[282]:


remove_all_attrs_except(soup)


# In[283]:


new_head = soup.new_tag("head")
soup.html.append(new_head)

css = soup.new_tag("link", 
                   rel="stylesheet", 
                   href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css", 
                   integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
                   crossorigin="anonymous")
soup.head.append(css)


# In[284]:


with open("tes2.html", "w") as outf:
    outf.write(str(soup))


# ### Validations

# exit()

# reports = reports.merge(summary, on='indicator').drop(columns=['target_value',
#                                                      'actual_value',
#                                                      'percent_accomplishment',
#                                                      'indicator'])

# df = reports.drop(columns=['period_time']).set_index(['title',
#                         'description',
#                         'total_target',
#                         'total_actual',
#                         'aggr_total',
#                         'disaggregation_type',
#                         'dimension',
#                         'country'
#                        ]).sort_index().unstack('country',0)

# title_level = df.groupby(['title','description','disaggregation_type']).sum()
