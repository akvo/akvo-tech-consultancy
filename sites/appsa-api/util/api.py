import pandas as pd
import json
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

class Api:

    def api_results_framwork(self, env, project_id):
        self.env = env
        self.project_id = project_id
        print(env)
        results_framework = rsr.api(env,'results_framework','project',project_id)['results']
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
            'dimension_values':dimension_values,
            'dimension_data':data_disaggregations
        }
        with open('./cache/results_framework.json', 'w') as outfile:
            json.dump(response, outfile)
        return response;

