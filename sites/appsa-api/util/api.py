import pandas as pd
import json
import os
from util.rsr import Rsr
from util.util import Printer

rsr = Rsr()
printer = Printer()

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

def trace_onechildren(list_id):
    results_framework = []
    for i, pid in enumerate(list_id):
        result_framework = rsr.api('results_framework','project',pid)['results']
        if i == 0:
            results_framework = result_framework
        else:
            for res in result_framework:
                results_framework.append(res)
    return results_framework

def no_trace(project_id):
    results_framework = []
    results_framework = rsr.api('results_framework','project',project_id)['results']
    return results_framework

def fill_country(x):
    country = x['country']
    if x['has_country']:
        country = x['project'].split(' ')[1]
    return country

class Api:

    def api_results_framwork(self, project_id):
        self.project_id = project_id
        results_framework = rsr.api('results_framework','project',project_id)['results']
        indicators = []
        periods = []
        dimension_names = []
        dimension_values = []
        data_disaggregations = []

        print(printer.get_time() + ' :: FOUND ' + str(len(results_framework)) + ' Results')
        t_indicators = 0
        t_periods = 0
        t_dimensions = 0
        t_dimension_values = 0
        t_period_data = 0
        for result_framework in results_framework:
            rf_id = {'result':result_framework['id']}
            t_indicators = t_indicators + len(result_framework['indicators'])
            for indicator in result_framework['indicators']:
                indicator_id = indicator['id']
                t_periods = t_periods + len(indicator['periods'])
                for period in indicator['periods']:
                    is_yearly = get_report_type(period['period_start'],period['period_end'])
                    period.update(is_yearly)
                    period.update(rf_id)
                    period.update({'indicator':indicator_id})
                    periods.append(period)
                    t_period_data = t_period_data + len(period['data'])
                    for data in period['data']:
                        if len(data) > 0:
                            period_id = data['period']
                            for disaggregations in data['disaggregations']:
                                disaggregations.update({'data_id': data['id']})
                                disaggregations.update({'period_id': period_id})
                                data_disaggregations.append(disaggregations)
                del indicator['periods']
                t_dimensions = t_dimensions + len(indicator['dimension_names'])
                for dimension_name in indicator['dimension_names']:
                    t_dimension_values = t_dimension_values + len(dimension_name['values'])
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

        print(printer.get_time() + ' :: FOUND ' + str(t_indicators) + ' Indicators')
        print(printer.get_time() + ' :: FOUND ' + str(t_periods) + ' Periods')
        print(printer.get_time() + ' :: FOUND ' + str(t_period_data) + ' Periods Data')
        print(printer.get_time() + ' :: FOUND ' + str(t_dimensions) + ' Dimension Names')
        print(printer.get_time() + ' :: FOUND ' + str(t_dimension_values) + ' Dimension Values')

        ## Update Results Framework
        print(printer.get_time() + ' :: GENERATING NEW CACHE /cache/results_framework.json')

        period_list = pd.DataFrame(periods)
        period_list['period_date'] = period_list['period_start'] + ' - ' + period_list['period_end']
        period_list['type'] = period_list.apply(lambda x: 'Yearly' if x['is_yearly'] else 'Semester', axis=1)
        period_list = period_list[['period_date','type']].groupby(['type','period_date']).first().reset_index()
        period_list = period_list.groupby('type')['period_date'].apply(list).to_dict()

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
            'period_list':period_list,
            'dimension_names':dimension_names,
            'dimension_values':dimension_values,
            'dimension_data':data_disaggregations
        }
        directory = './cache/results_framework'
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(directory + '/' + project_id + '.json', 'w') as outfile:
            json.dump(response, outfile)
        return response;

    def datatable(self, project_id, project_type, filter_date, filter_country):
        self.project_id = project_id
        self.project_type = project_type
        self.filter_date = filter_date
        self.filter_country = filter_country
        related_project = rsr.api('related_project','related_project',project_id)
        project_list = list(pd.DataFrame(related_project['results'])['project'])
        # project_list.append(project_id)
        if project_type == 'child':
            results_framework = no_trace(project_id)
        if project_type == 'parent':
            results_framework = trace_onechildren(project_list)
        results_framework = pd.DataFrame(results_framework)
        results_framework['child_projects'] = results_framework['child_projects'].apply(get_sibling_id)
        results_framework = results_framework.to_dict('records')
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
        dimension_values = pd.DataFrame(dimension_values).groupby(['id']).first().reset_index()
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
        order_columns = ['id','indicator_id','dimension_name','project_title','indicator','commodity','period','country','type','value']
        targets = targets[order_columns]
        disaggregations_merged = disaggregations_merged[order_columns]
        periods = pd.DataFrame(periods)
        periods = periods[['id','is_yearly','period_start','period_end']]
        periods['period_date'] = periods['period_start'] + ' - ' + periods['period_end']
        ajax = pd.concat([disaggregations_merged,targets],sort=False)
        ajax = ajax.sort_values(by=['indicator_id','dimension_name','id'])
        ajax = ajax.merge(periods,
                how='inner',
                left_on='period',
                right_on='id',
                suffixes=('_data','_period')).sort_values(['id_data','indicator_id','dimension_name'])
        remove_columns = [
            'period_end',
            'period_start',
            'id_period',
            'period',
            'is_yearly'
        ]
        ajax = pd.concat([disaggregations_merged,targets],sort=False)
        ajax = ajax.sort_values(by=['indicator_id','dimension_name','id'])
        ajax = ajax.merge(periods,how='inner',left_on='period',right_on='id',suffixes=('_data','_period')).sort_values(['id_data','indicator_id','dimension_name'])
        remove_columns = [
            'period_end',
            'period_start',
            'id_period',
            'period',
            'is_yearly'
        ]
        ajax = ajax.drop(columns=remove_columns)
        ajax = ajax[ajax['period_date'] == filter_date].drop(columns=['period_date'])
        order_columns = ['project_title','indicator_id','indicator','dimension_name','commodity','type','country','value','id_data']
        ajax = ajax[order_columns]
        ajax_group = ['project_title','indicator_id','indicator','id_data','commodity','country','type','dimension_name']
        ajax_sort = ['indicator_id','id_data','dimension_name']
        ajax = ajax.groupby(ajax_group).sum()
        ajax = ajax.unstack('type').unstack('country').sort_values(ajax_sort)
        ajax = ajax.groupby(level=[0,2,4],sort=False).sum().astype(int)
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
        ajax = ajax.to_dict('records')
        return ajax
