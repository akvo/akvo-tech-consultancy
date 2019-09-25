
# coding: utf-8

# ## Init Dependencies

# In[73]:


import requests
import os
import pandas as pd
from datetime import datetime
import json
import numpy as np


# ### Workspace Setup

# In[74]:


pd.options.display.max_rows = 999
pd.options.display.max_columns = 999


# ## Set Static Variables

# In[75]:


URL = 'http://rsr.akvo.org/rest/v1/'
PROJECT_ID = '7950'
#PROJECT_TYPE = 'grand_parent'
PROJECT_TYPE = 'parent'
#PROJECT_TYPE = 'child'
RSR_TOKEN = os.environ['RSR_TOKEN']
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'


# ## Set Filter

# In[76]:


FILTER_DATE = '2017-01-01 - 2017-12-31'
FILTER_COUNTRY = ['Malawi','Mozambique','Zambia']
HTML_TYPE = 'table' #print or table


# ## Set Authentication

# In[77]:


headers = {
    'content-type': 'application/json',
    'Authorization': RSR_TOKEN
}


# ## Helper Functions

# In[78]:


def get_response(endpoint, param, value):
    uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
    print(get_time() + ' Fetching - ' + uri)
    data = requests.get(uri, headers=headers)
    data = data.json()
    return data


# In[79]:


def get_time():
    now = datetime.now().time().strftime("%H:%M:%S")
    return now


# In[80]:


def get_sibling_id(x):
    for k,v in x.items():
        return k


# In[81]:


def get_report_type(ps,pe):
    rt = {'is_yearly':False}
    try:
        psm = ps.split('-')[1]
        pem = pe.split('-')[1]
        if psm == '01' and pem == '12':
            rt = {'is_yearly':True}
        if psm == '01' and pem == '01':
            rt = {'is_yearly':True}
    except:
        pass
    return rt


# In[83]:


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

# In[84]:


related_project = get_response('related_project','related_project',PROJECT_ID)


# In[85]:


results_framework_list = [PROJECT_ID]
if PROJECT_TYPE == 'parent':
    results_framework_list = list(pd.DataFrame(related_project['results'])['project'])
if PROJECT_TYPE == 'grand_parent':
    parent_list = list(pd.DataFrame(related_project['results'])['project'])
    results_framwork_list = []
    for second_level in parent_list:
        second_list = get_response('related_project','related_project',second_level)
        try:
            second_list = list(pd.DataFrame(second_list['results'])['project'])
            for third_level in second_list:
                results_framework_list.append(third_level)
        except:
            pass


# In[87]:


results_framework_list


# ### Trace All Children (Alternative)

# In[88]:


def trace_all_childrens(project_id, all_childs, level):
    related = get_response('related_project','related_project',project_id)
    if len(related['results']) > 0:
        for result in related['results']:
            level = level + 1
            print(level)
            all_childs.append(result)
            trace_all_childrens(result['project'], all_childs, level)
    return all_childs


# ### Trace All Children Results(Alternative)

# In[89]:


def trace_all_results(all_childs):
    results_framework = []
    for child in all_childs:
        res = get_response('results_framework','project',child['project'])
        for rf in res['results']:
            results_framework.append(rf)
    return results_framework


# ### Concat Results Frameworks (Alternative)

# In[90]:


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

# In[91]:


results_framework = []
def no_trace():
    results_framework = get_response('results_framework','project',PROJECT_ID)['results']
    return results_framework


# ### Choose Trace Level

# In[92]:


if PROJECT_TYPE == 'child':
    results_framework = no_trace()
if PROJECT_TYPE == 'parent':
    results_framework = trace_onechildren()
if PROJECT_TYPE == 'grand_parent':
    #all_childrens = trace_all_childrens(PROJECT_ID, [],1)
    results_framework = trace_onechildren()


# ## Begin Transformations

# In[93]:


results_framework = pd.DataFrame(results_framework)


# ### Generate List of All Objects

# In[94]:


results_framework['child_projects'] = results_framework['child_projects'].apply(get_sibling_id)


# In[95]:


if PROJECT_TYPE == 'grand_parent':
    results_framwork = results_framework[results_framework['child_projects'].isnull()].reset_index().drop(columns=['index'])


# In[96]:


results_framework = results_framework.to_dict('records')


# In[230]:


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
                        disaggregation.update({'result_id':result_framework['id']})
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
                    disaggregation_target.update({'result_id':result_framework['id']})
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

# In[231]:


dimension_values = pd.DataFrame(dimension_values).groupby(['id']).first().reset_index()


# ## DN

# In[232]:


# In[233]:


def fill_country(x):
    country = x['country']
    if country.lower() not in  ['zambia','malawi','mozambique']:
        country = x['project'].split(' ')[1]
    return country


# In[234]:


dimension_names = pd.DataFrame(dimension_names).groupby(['id']).first()
dimension_names = dimension_names.drop(columns=['values','project','parent_dimension_name','result','indicator']).reset_index()
dimension_names = dimension_names.rename(columns={'id':'dimension_id','name':'dimension_name'})
dimension_values = dimension_values.merge(dimension_names,left_on='name',right_on='dimension_id',how='outer')
remove_columns = [
    'created_at',
    'last_modified_at',
    'numerator',
    'denominator',
    'narrative',
    'dimension_value',
    'incomplete_data',
    'update',
    'dimension_name_disaggregation',
    'dimension_id'
]
rename_columns = {
    'value_dimension_values': 'disaggregation_name',
    'value_disaggregation': 'disaggregation_value',
    'dimension_name_dimension_values':'dimension_name'
}
fill_values = {
    'disaggregation_value':0,
    'incomplete_data':True
}
column_order = ['parent_dimension_value',
                'parent_period',
                'result',
                'country',
                'dimension_'
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
integer_list = ['id','name','parent_dimension_value','result','parent_period','dimension_value','dimension_id','period']
targets[integer_list] = targets[integer_list].astype(int)
rename_columns = {'value_dimension_values': 'disaggregation_name'}
unavailable_columns = ['disaggregation_value', 'incomplete_data','dimension_value','dimension_dimension_name']
column_order = [x for x in column_order if x not in unavailable_columns]
column_order = column_order + ['value','dimension_name','dimension_id']
targets = targets.rename(columns=rename_columns)[column_order]
targets['indicator_id'] = targets['indicator_id'].apply(lambda x: int(float(x)))
targets['type'] = 'Y4 RCoLs Targets'
targets['country'] = ''
targets['country'] = targets.apply(fill_country, axis = 1)
disaggregations_merged = disaggregations_merged.rename(columns={'name':'dimension_id'})
order_columns = [
        'id',
        'result',
        'indicator_id',
        'dimension_id',
        'project_title',
        'indicator',
        'dimension_name',
        'commodity',
        'period',
        'country',
        'type',
        'value'
]
targets = targets[order_columns]
disaggregations_merged = disaggregations_merged[order_columns]
periods_short = pd.DataFrame(periods)
periods_short = periods_short[['id','is_yearly','period_start','period_end']]
periods_short['period_date'] = periods_short['period_start'] + ' - ' + periods_short['period_end']
ajax = pd.concat([disaggregations_merged,targets],sort=False)
ajax = ajax.sort_values(by=['result','indicator_id','dimension_id','id'])
ajax = ajax.merge(periods_short,how='inner',left_on='period',right_on='id',suffixes=('_data','_period')).sort_values(['id_data','indicator_id','dimension_name'])
remove_columns = [
    'period_end',
    'period_start',
    'id_period',
    'period',
    'is_yearly'
]
ajax = ajax.drop(columns=remove_columns)
ajax = ajax[ajax['period_date'] == FILTER_DATE].drop(columns=['period_date'])
order_columns = ['result','project_title','indicator_id','indicator','dimension_id','dimension_name','commodity','type','country','value','id_data']
ajax = ajax[order_columns]
ajax_group = ['result','project_title','indicator_id','indicator','dimension_id','dimension_name','id_data','commodity','country','type']
ajax_sort = ['result','indicator_id','dimension_id','id_data']
ajax = ajax.groupby(ajax_group).sum()
ajax = ajax.unstack('type').unstack('country').sort_values(ajax_sort)
ajax = ajax.groupby(level=[1,3,5,7],sort=False).sum().astype(int)
ajax = pd.DataFrame(ajax['value'].to_records())
ajax = ajax.rename(columns={
    "('Cumulative Actual Values', 'Malawi')": "CA-MW",
    "('Cumulative Actual Values', 'Mozambique')": "CA-MZ",
    "('Cumulative Actual Values', 'Zambia')": "CA-ZA",
    "('Y4 RCoLs Targets', 'Malawi')":"TG-MW",
    "('Y4 RCoLs Targets', 'Mozambique')":"TG-MZ",
    "('Y4 RCoLs Targets', 'Zambia')":"TG-ZA"
})
ajax['TG-TTL'] = ajax['TG-MW'] + ajax['TG-MZ'] + ajax['TG-ZA']
ajax['CA-TTL'] = ajax['CA-MW'] + ajax['CA-MZ'] + ajax['CA-ZA']
array = pd.concat([disaggregations_merged,targets],sort=False)
array = array.sort_values(by=['result','indicator_id','dimension_id','id'])
array = array.merge(periods_short,how='inner',left_on='period',right_on='id',suffixes=('_data','_period')).sort_values(['id_data','indicator_id','dimension_name'])


# In[260]:


array['variable'] = array.apply(lambda x: {
    'id':x['id_data'],
    'result':x['result'],
    'country':x['country'],
    'type':x['type'],
    'period':x['period'],
    'date':x['period_date'],
    'indicator_id':x['indicator_id'],
    'indicator_name':x['indicator'],
    'dimension':x['dimension_id'],
    'dimension_name':x['dimension_id'],
    'commodity':x['commodity'],
    'value': x['value'],
},axis=1)


# In[261]:


array = array[array['period_date'] == FILTER_DATE].drop(columns=['period','period_start','period_end','is_yearly'])
array_group =  ['result','project_title','indicator_id','indicator','dimension_id','dimension_name','id_data','commodity','country','type']
array_sort = ['result','indicator_id','dimension_id','id_data']


# In[262]:


def group_attribute(a):
    data = []
    for b in a:
        data.append(b)
    return(data)


# In[263]:


array = array.groupby(array_group)['variable'].apply(group_attribute).reset_index()
array = array.groupby(array_group).first().unstack('type').unstack('country').sort_values(array_sort)


# In[264]:


array = array.groupby(level=[1,3,5,7],sort=False).first()
array = pd.DataFrame(array['variable'].to_records())
array = array.rename(columns={
    "('Cumulative Actual Values', 'Malawi')": "CA-MW-D",
    "('Cumulative Actual Values', 'Mozambique')": "CA-MZ-D",
    "('Cumulative Actual Values', 'Zambia')": "CA-ZA-D",
    "('Y4 RCoLs Targets', 'Malawi')":"TG-MW-D",
    "('Y4 RCoLs Targets', 'Mozambique')":"TG-MZ-D",
    "('Y4 RCoLs Targets', 'Zambia')":"TG-ZA-D"
})


# In[265]:


array = array.drop(columns=['project_title','indicator','commodity','dimension_name'])
array = pd.merge(ajax, array, left_index=True, right_index=True)


# In[266]:


array = array.replace({np.nan: None})


# In[267]:


project = list(pd.DataFrame(results_framework).groupby('title').first().reset_index()['title'])


# In[268]:


array


# ## Generate Results

# ### Merge Result Period

# In[43]:


resutls = pd.concat([disaggregations_merged,targets],sort=False)
resutls = resutls.sort_values(by=['indicator_id','dimension_name','id'])


# In[44]:


resutls['commodity'] = '• ' + resutls['commodity']
resutls['indicator'] = '+ ' + resutls['indicator']
resutls['project_title'] = '### ' + resutls['project_title']


# In[45]:


results = resutls.merge(periods_short, how='inner', left_on='period', right_on='id', suffixes=('_data','_period'))
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

# In[46]:


results = results[results['period_date'] == FILTER_DATE]


# ### Filter Country

# In[47]:


results = results[results['country'].isin(FILTER_COUNTRY)]


# ### Set Grouping

# In[48]:


group_table = ['project_title','indicator','commodity','country','type']


# In[49]:


results = results.drop(columns=['period_date','is_yearly'])


# In[50]:


original = resutls.groupby(['project_title',
                            'indicator',
                            'indicator_id',
                            'commodity',
                            'dimension_name',
                            'country',
                            'type']).first()


# In[51]:


original.drop(columns=['id','period','result']).sort_values(by=[
    'project_title',
    'indicator_id',
    'dimension_name'])


# In[52]:


results = results.groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[53]:


indicator_sum = results.sum(level=[0,1])
indicator_sum = indicator_sum.stack().stack().reset_index().rename(columns={0:'value'}).dropna()
indicator_sum['commodity'] = ''
results = results.stack().stack().reset_index()
results = results.append(indicator_sum, sort='False')
results = results.groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[54]:


results = results.astype(int)


# In[55]:


project_title = results.sum(level=[0])
project_title = project_title.stack().stack().reset_index()
project_title['value'] = ''
project_title['indicator'] = ''
project_title['commodity'] = ''
results = results.stack().stack().reset_index()
results = results.append(project_title, sort='False')


# In[56]:


results = results.drop(columns='result').groupby(group_table).first().unstack('type').unstack('country').fillna(0)


# In[57]:


pd.DataFrame(results.to_records())


# In[58]:


html_output = 'file_name.html'
results.to_html(html_output)


# ## Beautify HTML

# In[59]:


from bs4 import BeautifulSoup as bs


# In[60]:


variable_name = 'PDO Level Results Indicators'


# In[61]:


with open(html_output) as htm:
    html = htm.read()
    soup = bs(html)


# In[62]:


soup.find('table')['border'] = 0
soup.find('table')['class'] = "table"


# In[63]:


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


# In[64]:


soup = remove_all_attrs_except(soup)


# In[65]:


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


# In[66]:


table = bs(str(soup.body.table))
soup.html.body.decompose()


# In[67]:


for i, tr in enumerate(table.html.body.table.find_all('tr')):
    if tr.contents == ['\n']:
        tr.decompose()


# In[68]:


new_body = soup.new_tag("body")
soup.html.append(new_body)
soup.body.append(table.html.body.table)


# In[69]:


datatable_js = soup.new_tag("script",
                   type="text/javascript",
                   src="https://cdn.datatables.net/v/bs4/jq-3.3.1/dt-1.10.18/b-1.5.6/b-flash-1.5.6/fh-3.1.4/r-2.2.2/rg-1.1.0/datatables.min.js"
)


# In[70]:


custom_js = soup.new_tag("script",
                   type="text/javascript",
                   src="/table.js"
)


# In[71]:


soup.head.append(datatable_js)
soup.body.append(custom_js)


# In[72]:


with open("file_name_edit.html", "w") as outf:
    outf.write(str(soup))

