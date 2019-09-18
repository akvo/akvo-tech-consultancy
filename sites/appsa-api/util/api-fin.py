
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
PROJECT_ID = '7950'
PROJECT_TYPE = 'parent'
#PROJECT_TYPE = 'child'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'


# ## Set Filter

# In[55]:


FILTER_DATE = '2017-01-01 - 2017-12-31'
FILTER_COUNTRY = ['Malawi','Mozambique','Zambia']
HTML_TYPE = 'table' #print or table


# ## Set Authentication

# In[5]:


headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}


# ## Helper Functions

# In[6]:


def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' Fetching - ' + uri)
    data = requests.get(uri, headers=headers)
    data = data.json()
    return data


# In[7]:


def get_time():
    now = datetime.now().time().strftime("%H:%M:%S")
    return now


# In[8]:


def get_sibling_id(x):
    for k,v in x.items():
        return k


# In[9]:


def get_report_type(ps,pe):
    rt = {'is_yearly':False}
    psm = ps.split('-')[1]
    pem = pe.split('-')[1]
    if psm == '01' and pem == '12':
        rt = {'is_yearly':True}
    if psm == '01' and pem == '01':
        rt = {'is_yearly':True}
    return rt


# In[10]:


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

# In[11]:


related_project = get_response('related_project','related_project',PROJECT_ID)


# In[12]:


results_framework_list = list(pd.DataFrame(related_project['results'])['project'])


# In[13]:


results_framework_list


# ### Trace All Children (Alternative)

# In[14]:


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

# In[15]:


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

# In[16]:


def no_trace():
    results_framework = []
    results_framework = get_response('results_framework','project',PROJECT_ID)['results']
    return results_framework


# ### Choose Trace Level

# In[17]:


if PROJECT_TYPE == 'child':
    results_framework = no_trace()
if PROJECT_TYPE == 'parent':
    results_framework = trace_onechildren()
#results_framework = trace_all_childrens(PROJECT_ID)


# ## Begin Transformations

# In[18]:


results_framework = pd.DataFrame(results_framework)


# ### Generate List of All Objects

# In[19]:


results_framework['child_projects'] = results_framework['child_projects'].apply(get_sibling_id)


# In[20]:


#results_framework = results_framework[results_framework['child_projects'].notnull()]


# In[21]:


results_framework = results_framework.to_dict('records')


# In[22]:


indicators = []
periods = []
dimension_names = []
dimension_values = []
disaggregations = []
disaggregation_targets = []
for result_framework in results_framework:
    rf_id = {'result':result_framework['id']}
    rf_project = {'project':result_framework['project_title']}
    rf_title = {'project_title':result_framework['title']}
    for indicator in result_framework['indicators']:
        indicator_id = indicator['id']
        indicator_title = {'indicator':indicator['title']}
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
                    for disaggregation in data['disaggregations']:
                        disaggregation.update({'period':period['id']})
                        disaggregation.update({'parent_period':period['parent_period']})
                        disaggregation.update(rf_title)
                        disaggregation.update(rf_project)
                        disaggregation.update({'indicator_id':indicator_id})
                        disaggregation.update(indicator_title)
                        disaggregations.append(disaggregation)
            if len(period['disaggregation_targets']) > 0:
                for disaggregation_target in period['disaggregation_targets']:
                    disaggregation_target.update({'period':period['id']})
                    disaggregation_target.update({'parent_period':period['parent_period']})
                    disaggregation_target.update({'indicator_id':indicator_id})
                    disaggregation_target.update(indicator_title)
                    disaggregation_target.update(rf_title)
                    disaggregation_target.update(rf_project)
                    disaggregation_targets.append(disaggregation_target)
        #del indicator['periods']
        for dimension_name in indicator['dimension_names']:
            for dimension_value in dimension_name['values']:
                dimension_value.update(rf_id)
                dimension_update = get_dimension_country(dimension_value)
                dimension_value.update(dimension_update)
                dimension_values.append(dimension_value)
            # del dimension_name['values']
            dimension_name.update(rf_id)
            dimension_name.update({'indicator':indicator_id})
            dimension_names.append(dimension_name)
        #del indicator['dimension_names']
        indicators.append(indicator)


# ### Merge Dimension Values & Disaggregations

# In[23]:


dimension_values = pd.DataFrame(dimension_values).groupby(['id']).first().reset_index()


# In[24]:


def fill_country(x):
    country = x['country']
    if x['has_country']:
        country = x['project'].split(' ')[1]
    return country


# In[25]:


remove_columns = [
    'created_at',
    'last_modified_at',
    'numerator',
    'denominator',
    'dimension_name',
    'narrative',
    'dimension_value',
    'incomplete_data',
    'update'
]
rename_columns = {
    'name': 'dimension_name',
    'value_dimension_values': 'disaggregation_name',
    'value_disaggregation': 'disaggregation_value',
}
fill_values = {
    'disaggregation_value':0,
    'incomplete_data':True
}
column_order = ['parent_dimension_value',
                'parent_period',
                'result',
                'dimension_name',
                'disaggregation_name',
                'id',
                'commodity',
                'has_country',
                'has_commodity',
                'incomplete_data',
                'disaggregation_value',
                'period',
                'project_title',
                'project',
                'indicator',
                'indicator_id'
]
disaggregation_value = ['disaggregation_value']
disaggregations_merged = pd.DataFrame(disaggregations).drop(columns=['id']).merge(
    dimension_values,
    how='outer',
    left_on='dimension_value',
    right_on='id',
    suffixes=('_disaggregation','_dimension_values'))
disaggregations_merged = disaggregations_merged.drop(columns=remove_columns)
disaggregations_merged = disaggregations_merged.rename(columns=rename_columns)
disaggregations_merged = disaggregations_merged.fillna(value=fill_values)
disaggregations_merged['value'] = disaggregations_merged['disaggregation_value'].apply(lambda x:int(float(x)))
disaggregations_merged = disaggregations_merged.drop(columns=['disaggregation_value'])
disaggregations_merged = disaggregations_merged.dropna(subset=['parent_period'])
disaggregations_merged['parent_period'] = disaggregations_merged['parent_period'].astype(int)
disaggregations_merged['period'] = disaggregations_merged['period'].apply(lambda x: int(float(x)))
disaggregations_merged['indicator_id'] = disaggregations_merged['indicator_id'].apply(lambda x: int(float(x)))
disaggregations_merged['type'] = 'Cumulative Actual Values'
disaggregations_merged['country'] = disaggregations_merged.apply(fill_country , axis = 1)


# In[26]:


targets = pd.DataFrame(disaggregation_targets).fillna(0).drop(columns=['id']).merge(
    dimension_values,
    how='outer',
    left_on='dimension_value',
    right_on='id',
    suffixes=('_target','_dimension_values'))
targets = targets.dropna(subset=['parent_period','id'])
targets['has_commodity'] = False
targets['has_country'] = True
fill_values = {
    'value_target':0
}
targets  = targets.fillna(value=fill_values)
targets['value'] =  targets['value_target'].apply(lambda x:int(float(x)))
targets = targets.drop(columns=['value_target'])
integer_list = ['id','name','parent_dimension_value','result','parent_period','dimension_value','period']
targets[integer_list] = targets[integer_list].astype(int)
rename_columns = {
    'name': 'dimension_name',
    'value_dimension_values': 'disaggregation_name'
}
column_order = [x for x in column_order if x not in ['disaggregation_value', 'incomplete_data','dimension_value']]
column_order.append('value')
targets = targets.rename(columns=rename_columns)[column_order]
targets['indicator_id'] = targets['indicator_id'].apply(lambda x: int(float(x)))
targets['type'] = 'Y4 RCoLs Targets'
targets['country'] = ''
targets['country'] = targets.apply(fill_country, axis = 1)


# In[27]:


order_columns = ['id','indicator_id','dimension_name','project_title','indicator','commodity','period','country','type','value']


# In[28]:


targets = targets[order_columns]
disaggregations_merged = disaggregations_merged[order_columns]


# ## Ajax

# In[628]:


ajax = pd.concat([disaggregations_merged,targets],sort=False)
ajax = ajax.sort_values(by=['indicator_id','dimension_name','id'])


# In[629]:


ajax = ajax.merge(periods, how='inner', left_on='period', right_on='id', suffixes=('_data','_period'))
remove_columns = [
    'period_end',
    'period_start',
    'id_period',
    'period',
    'is_yearly'
]
ajax = ajax.drop(columns=remove_columns)


# In[630]:


order_columns = ['project_title','indicator_id','indicator','dimension_name','commodity','type','country','period_date','value','id_data']
ajax = ajax[order_columns]


# ### Filter Ajax

# In[631]:


ajax = ajax[ajax['period_date'] == FILTER_DATE].drop(columns=['period_date'])


# In[634]:


ajax = ajax.groupby([x for x in order_columns if x not in['value','period_date']]).first().sort_index()


# In[639]:


ajax = ajax.unstack('type').unstack('country').fillna(0).astype(int)


# In[643]:


ajax = pd.DataFrame(ajax['value'].to_records())


# In[646]:


ajax.rename(columns={
    "('Cumulative Actual Values', 'Malawi')": "CA-MW",
    "('Cumulative Actual Values', 'Mozambique')": "CA-MZ",
    "('Cumulative Actual Values', 'Zambia')": "CA-ZA",
    "('Y4 RCoLs Targets', 'Malawi')":"TG-MW",
    "('Y4 RCoLs Targets', 'Mozambique')":"TG-MZ",
    "('Y4 RCoLs Targets', 'Zambia')":"TG-ZA"
}).to_dict('records')


# ## Generate Results

# ### Redefining Period

# In[569]:


periods = pd.DataFrame(periods)
periods = periods[['id','is_yearly','period_start','period_end']]
periods['period_date'] = periods['period_start'] + ' - ' + periods['period_end']


# ### Merge Result Period

# In[601]:


resutls = pd.concat([disaggregations_merged,targets],sort=False)
resutls = resutls.sort_values(by=['indicator_id','dimension_name','id'])


# In[568]:


resutls['commodity'] = '• ' + resutls['commodity']
resutls['indicator'] = '+ ' + resutls['indicator']
resutls['project_title'] = '### ' + resutls['project_title']


# In[570]:


results = resutls.merge(periods, how='inner', left_on='period', right_on='id', suffixes=('_data','_period'))
remove_columns = [
    'id_data',
    'period_end',
    'period_start',
    'id_period',
    'indicator_id',
    'id_period',
    'period',
    'dimension_name'
]
results = results.drop(columns=remove_columns)


# ## Filter Parameters

# ### Filter Date

# In[571]:


results = results[results['period_date'] == FILTER_DATE]


# ### Filter Country

# In[572]:


results = results[results['country'].isin(FILTER_COUNTRY)]


# ### Set Grouping

# In[573]:


group_table = ['project_title','indicator','commodity','country','type']


# In[574]:


results = results.drop(columns=['period_date','is_yearly'])


# In[597]:


original = resutls.groupby(['project_title',
                            'indicator',
                            'indicator_id',
                            'commodity',
                            'dimension_name',
                            'country',
                            'type']).first()


# In[600]:


original.drop(columns=['id','period']).sort_values(by=[
    'project_title',
    'indicator_id',
    'dimension_name'])


# In[559]:


results = results.groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[560]:


indicator_sum = results.sum(level=[0,1])
indicator_sum = indicator_sum.stack().stack().reset_index().rename(columns={0:'value'}).dropna()
indicator_sum['commodity'] = ''
results = results.stack().stack().reset_index()
results = results.append(indicator_sum, sort='False')
results = results.groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[561]:


results = results.astype(int)


# In[562]:


project_title = results.sum(level=[0])
project_title = project_title.stack().stack().reset_index()
project_title['value'] = ''
project_title['indicator'] = ''
project_title['commodity'] = ''
results = results.stack().stack().reset_index()
results = results.append(project_title, sort='False')


# In[563]:


results = results.groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[565]:


# pd.DataFrame(results.to_records())


# In[497]:


html_output = 'file_name.html'
results.to_html(html_output)


# ## Beautify HTML

# In[498]:


from bs4 import BeautifulSoup as bs


# In[499]:


variable_name = 'PDO Level Results Indicators'


# In[500]:


with open(html_output) as htm:
    html = htm.read()
    soup = bs(html)


# In[501]:


soup.find('table')['border'] = 0
soup.find('table')['class'] = "table"


# In[502]:


def remove_all_attrs_except(sp):
    whitelist = ['border','table']
    blacklist = ['project_title','indicator','commodity','value','country']
    header = ['Cumulative Actual Values','Y4 RCoLs Targets']
    country = ['Malawi','Zambia','Mozambique']
    for tag in sp.find_all(True):
        if tag.name == 'table':
            tag['id'] = 'rsrtable'
        if tag.name not in whitelist:
            tag.attrs = {}
        if tag.name == 'th':
            if '•' in tag.text:
                text = str(tag.text).replace('•','')
                tag.string.replace_with(bs(text))
                tag['style']='padding-left:50'
            if '+' in tag.text:
                text = str(tag.text).replace('+','')
                tag.string.replace_with(bs(text))
                tag['style']='padding-left:30'
            if '###' in tag.text:
                text = str(tag.text).replace('###','')
                tag.string.replace_with(bs(text))
                if HTML_TYPE == 'print':
                    tag['colspan'] = 7
                else:
                    tag.decompose()
        if tag.text == '0':
            tag.string.replace_with('-')
            tag['class'] = 'text-right'
        if tag.text == '':
            tag.decompose()
        if tag.text in blacklist:
            tag.decompose()
        if tag.text == 'type':
            tag.string.replace_with(bs(variable_name))
            tag['rowspan'] = 2
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
    return sp


# In[503]:


soup = remove_all_attrs_except(soup)


# In[504]:


new_head = soup.new_tag("head")
soup.html.append(new_head)

css = soup.new_tag("link",
                   rel="stylesheet",
                   href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
                   integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
                   crossorigin="anonymous")
datatable_css = soup.new_tag("link",
                   rel="stylesheet",
                   href="https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.18/b-1.5.6/b-flash-1.5.6/fh-3.1.4/r-2.2.2/rg-1.1.0/datatables.min.css"
)
soup.head.append(css)
soup.head.append(datatable_css)


# In[505]:


table = bs(str(soup.body.table))
soup.html.body.decompose()


# In[506]:


for i, tr in enumerate(table.html.body.table.find_all('tr')):
    if tr.contents == ['\n']:
        tr.decompose()


# In[507]:


new_body = soup.new_tag("body")
soup.html.append(new_body)
soup.body.append(table.html.body.table)


# In[508]:


datatable_js = soup.new_tag("script",
                   type="text/javascript",
                   src="https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.18/b-1.5.6/b-flash-1.5.6/fh-3.1.4/r-2.2.2/rg-1.1.0/datatables.min.js"
)


# In[509]:


custom_js = soup.new_tag("script",
                   type="text/javascript",
                   src="/table.js"
)


# In[510]:


soup.head.append(datatable_js)
soup.body.append(custom_js)


# In[511]:


with open("file_name_edit.html", "w") as outf:
    outf.write(str(soup))

