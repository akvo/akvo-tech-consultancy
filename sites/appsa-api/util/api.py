import pandas as pd
import json
import os
import numpy as np
from util.rsr import Rsr
from util.util import Printer

rsr = Rsr()
printer = Printer()


def get_sibling_id(x):
    for k, v in x.items():
        return k


def get_year(x):
    y = x['period_start'].split(' - ')[0]
    y = x['period_start'].split('-')[0]
    return y


def get_report_type(ps, pe):
    rt = {'is_yearly': False}
    try:
        psm = ps.split('-')[1]
        pem = pe.split('-')[1]
        if psm == '01' and pem == '12':
            rt = {'is_yearly': True}
        if psm == '01' and pem == '01':
            rt = {'is_yearly': True}
    except:
        pass
    return rt


def get_dimension_country(dv):
    dp = dv['value'].split(' - ')
    dv = {}
    if dp[0].lower() in ['zambia', 'malawi', 'mozambique']:
        dv.update({
            'commodity': '',
            'country': dp[0],
            'has_commodity': False,
            'has_country': True
        })
    else:
        dv.update({
            'commodity': dp[0],
            'country': '',
            'has_commodity': False,
            'has_country': True
        })
    if len(dp) == 2:
        dv.update({
            'commodity': dp[0],
            'country': dp[1],
            'has_commodity': True,
            'has_country': True
        })
    return dv


def get_total_value(x, vtype):
    y = 0
    if x['indicator_type'] == 1:
        y = 0
        for a in ['MW', 'MZ', 'ZA']:
            try:
                y = y + x[f"{vtype}-{a}"]
            except:
                pass
    if x['indicator_type'] == 2:
        y = 0
        for a in ['MW', 'MZ', 'ZA']:
            try:
                y = y + x[f"{vtype}-{a}"]
            except:
                pass
        y = round(y / 3, 1)
    return y


def trace_onechildren(list_id):
    results_framework = []
    for i, pid in enumerate(list_id):
        result_framework = rsr.api('results_framework', 'project',
                                   pid)['results']
        if i == 0:
            results_framework = result_framework
        else:
            for res in result_framework:
                results_framework.append(res)
    return results_framework


def no_trace(project_id):
    results_framework = []
    results_framework = rsr.api('results_framework', 'project',
                                project_id)['results']
    return results_framework


def fill_country(x):
    country = x['country']
    if x['has_country']:
        country = x['project'].split(' ')[1]
    return country


def group_attribute(a):
    data = []
    for b in a:
        data.append(b)
    return data


def combineList(dataType, x):
    res = []
    ctr = ["MW", "MZ", "ZA"]
    for c in ctr:
        if (dataType == "CA"):
            col = "-".join(["CA", c, "D"])
        else:
            col = "-".join(["TG", c, "D"])
        try:
            if x[col] is not None:
                for a in x[col]:
                    res.append(a)
        except:
            pass
    return res


def filterEndPeriod(x):
    if x is None:
        return False
    if x == "":
        return False
    return x.split('-')[1] == '12'


class Api:
    def api_results_framwork(self, project_id):
        self.project_id = project_id
        results_framework = rsr.api('results_framework', 'project',
                                    project_id)['results']
        directory = './cache/results_framework/project/' + project_id + '.json'
        if not os.path.exists(directory):
            os.makedirs(directory)
        indicators = []
        periods = []
        dimension_names = []
        dimension_values = []
        data_disaggregations = []

        print(printer.get_time() + ' :: FOUND ' + str(len(results_framework)) +
              ' Results')
        t_indicators = 0
        t_periods = 0
        t_dimensions = 0
        t_dimension_values = 0
        t_period_data = 0
        for result_framework in results_framework:
            rf_id = {'result': result_framework['id']}
            t_indicators = t_indicators + len(result_framework['indicators'])
            for indicator in result_framework['indicators']:
                indicator_id = indicator['id']
                t_periods = t_periods + len(indicator['periods'])
                for period in indicator['periods']:
                    is_yearly = get_report_type(period['period_start'],
                                                period['period_end'])
                    period.update(is_yearly)
                    period.update(rf_id)
                    period.update({'indicator': indicator_id})
                    periods.append(period)
                    t_period_data = t_period_data + len(period['data'])
                    for data in period['data']:
                        if len(data) > 0:
                            period_id = data['period']
                            for disaggregations in data['disaggregations']:
                                disaggregations.update({'data_id': data['id']})
                                disaggregations.update(
                                    {'period_id': period_id})
                                data_disaggregations.append(disaggregations)
                del indicator['periods']
                t_dimensions = t_dimensions + len(indicator['dimension_names'])
                for dimension_name in indicator['dimension_names']:
                    t_dimension_values = t_dimension_values + len(
                        dimension_name['values'])
                    for dimension_value in dimension_name['values']:
                        dimension_value.update(rf_id)
                        dimension_update = get_dimension_country(
                            dimension_value)
                        dimension_value.update(dimension_update)
                        dimension_values.append(dimension_value)
                    del dimension_name['values']
                    dimension_name.update(rf_id)
                    dimension_name.update({'indicator': indicator_id})
                    dimension_names.append(dimension_name)
                del indicator['dimension_names']
                indicators.append(indicator)

        print(printer.get_time() + ' :: FOUND ' + str(t_indicators) +
              ' Indicators')
        print(printer.get_time() + ' :: FOUND ' + str(t_periods) + ' Periods')
        print(printer.get_time() + ' :: FOUND ' + str(t_period_data) +
              ' Periods Data')
        print(printer.get_time() + ' :: FOUND ' + str(t_dimensions) +
              ' Dimension Names')
        print(printer.get_time() + ' :: FOUND ' + str(t_dimension_values) +
              ' Dimension Values')

        ## Update Results Framework
        print(printer.get_time() +
              ' :: GENERATING NEW CACHE /cache/results_framework.json')
        period_list = pd.DataFrame(periods)
        period_list['period_date'] = period_list[
            'period_start'] + ' - ' + period_list['period_end']
        period_list['year'] = period_list.apply(get_year, axis=1)
        period_list['type'] = period_list.apply(
            lambda x: 'Yearly' if x['is_yearly'] else 'Semester', axis=1)
        period_list = period_list[['year', 'type', 'period_date'
                                   ]].groupby(['type', 'year', 'period_date'
                                               ]).first().reset_index()
        period_list['data'] = period_list.apply(lambda x: {
            'year': x['year'],
            'period_date': x['period_date']
        },
                                                axis=1)
        period_list = period_list.groupby('type')['data'].apply(list).to_dict()
        periods_df = pd.DataFrame(periods)
        periods_df = periods_df.groupby([
            'is_yearly', 'result'
        ]).size().to_frame('size').reset_index().to_dict('records')

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
            rf.update({'report_type': report_type})
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
            'results_framework': results_framework_new,
            'indicators': indicators,
            'periods': periods,
            'period_list': period_list,
            'dimension_names': dimension_names,
            'dimension_values': dimension_values,
            'dimension_data': data_disaggregations
        }
        directory = './cache/rf'
        if not os.path.exists(directory):
            os.makedirs(directory)
        with open(directory + '/' + project_id + '.json', 'w') as outfile:
            json.dump(response, outfile)
        return response

    def datatable(self, project_id, project_type, report_type, filter_date,
                  filter_country):
        self.project_id = project_id
        self.project_type = project_type
        self.filter_date = filter_date
        self.filter_country = filter_country
        related_project = rsr.api('related_project', 'related_project',
                                  project_id)
        if project_type == 'parent':
            project_list = list(
                pd.DataFrame(related_project['results'])['project'])
        if project_type == 'grand_parent':
            parent_list = list(
                pd.DataFrame(related_project['results'])['project'])
            project_list = []
            for second_level in parent_list:
                second_list = rsr.api('related_project', 'related_project',
                                      second_level)
                try:
                    second_list = list(
                        pd.DataFrame(second_list['results'])['project'])
                    for third_level in second_list:
                        project_list.append(third_level)
                except:
                    pass
        # project_list.append(project_id)
        if project_type == 'child':
            results_framework = no_trace(project_id)
        if project_type == 'parent':
            results_framework = trace_onechildren(project_list)
        if project_type == 'grand_parent':
            results_framework = trace_onechildren(project_list)
        results_framework = pd.DataFrame(results_framework)
        results_framework['child_projects'] = results_framework[
            'child_projects'].apply(get_sibling_id)
        if project_type == 'grand_parent':
            results_framework = results_framework[results_framework[
                'child_projects'].isnull()].reset_index().drop(
                    columns=['index'])
        results_framework = results_framework.to_dict('records')
        indicators = []
        periods = []
        dimension_names = []
        dimension_values = []
        disaggregations = []
        disaggregation_targets = []
        for result_framework in results_framework:
            rf_id = {'result': result_framework['id']}
            rf_project = {'project': result_framework['project_title']}
            rf_title = {'project_title': result_framework['title']}
            for indicator in result_framework['indicators']:
                indicator_id = indicator['id']
                indicator_title = {'indicator': indicator['title']}
                indicator_type = 0
                if indicator['measure'] != '':
                    indicator_type = int(indicator['measure'])
                indicator.update({'indicator_type': indicator_type})
                for period in indicator['periods']:
                    is_yearly = get_report_type(period['period_start'],
                                                period['period_end'])
                    period.update(rf_title)
                    period.update(rf_project)
                    period.update(is_yearly)
                    period.update(rf_id)
                    period.update({'indicator': indicator_id})
                    period.update({'indicator_type': indicator_type})
                    periods.append(period)
                    for data in period['data']:
                        if len(data) > 0:
                            for disaggregation in data['disaggregations']:
                                disaggregation.update({'period': period['id']})
                                disaggregation.update(
                                    {'parent_period': period['parent_period']})
                                disaggregation.update(
                                    {'result_id': result_framework['id']})
                                disaggregation.update(rf_title)
                                disaggregation.update(rf_project)
                                disaggregation.update(
                                    {'indicator_id': indicator_id})
                                disaggregation.update(indicator_title)
                                disaggregations.append(disaggregation)
                    if len(period['disaggregation_targets']) > 0:
                        for disaggregation_target in period[
                                'disaggregation_targets']:
                            disaggregation_target.update(
                                {'period': period['id']})
                            disaggregation_target.update(
                                {'parent_period': period['parent_period']})
                            disaggregation_target.update(
                                {'indicator_id': indicator_id})
                            disaggregation_target.update(indicator_title)
                            disaggregation_target.update(
                                {'result_id': result_framework['id']})
                            disaggregation_target.update(rf_title)
                            disaggregation_target.update(rf_project)
                            disaggregation_targets.append(
                                disaggregation_target)
                #del indicator['periods']
                for dimension_name in indicator['dimension_names']:
                    for dimension_value in dimension_name['values']:
                        dimension_value.update(rf_id)
                        dimension_update = get_dimension_country(
                            dimension_value)
                        dimension_value.update(dimension_update)
                        dimension_values.append(dimension_value)
                    # del dimension_name['values']
                    dimension_name.update(rf_id)
                    dimension_name.update({'indicator': indicator_id})
                    dimension_names.append(dimension_name)
                #del indicator['dimension_names']
                indicators.append(indicator)
        dimension_values = pd.DataFrame(dimension_values).groupby(
            ['id']).first().reset_index()
        dimension_names = pd.DataFrame(dimension_names).groupby(['id']).first()
        dimension_names = dimension_names.drop(columns=[
            'values', 'project', 'parent_dimension_name', 'result', 'indicator'
        ]).reset_index()
        dimension_names = dimension_names.rename(columns={
            'id': 'dimension_id',
            'name': 'dimension_name'
        })
        dimension_values = dimension_values.merge(dimension_names,
                                                  left_on='name',
                                                  right_on='dimension_id',
                                                  how='outer')
        remove_columns = [
            'created_at', 'last_modified_at', 'numerator', 'denominator',
            'narrative', 'dimension_value', 'incomplete_data', 'update',
            'dimension_name_disaggregation', 'dimension_id'
        ]
        rename_columns = {
            'value_dimension_values': 'disaggregation_name',
            'value_disaggregation': 'disaggregation_value',
            'dimension_name_dimension_values': 'dimension_name'
        }
        fill_values = {'disaggregation_value': 0, 'incomplete_data': True}
        column_order = [
            'parent_dimension_value', 'parent_period', 'result', 'country',
            'dimension_'
            'dimension_name', 'disaggregation_name', 'id', 'commodity',
            'has_country', 'has_commodity', 'incomplete_data',
            'disaggregation_value', 'period', 'project_title', 'project',
            'indicator', 'indicator_id'
        ]
        disaggregations_merged = pd.DataFrame(disaggregations).drop(
            columns=['id']).merge(dimension_values,
                                  how='outer',
                                  left_on='dimension_value',
                                  right_on='id',
                                  suffixes=('_disaggregation',
                                            '_dimension_values'))
        for rmv in remove_columns:
            try:
                disaggregations_merged = disaggregations_merged.drop(
                    columns=[rmv])
            except:
                pass
        disaggregations_merged = disaggregations_merged.rename(
            columns=rename_columns)
        disaggregations_merged = disaggregations_merged.fillna(
            value=fill_values)
        disaggregations_merged['value'] = disaggregations_merged[
            'disaggregation_value'].apply(lambda x: int(float(x)))
        disaggregations_merged = disaggregations_merged.drop(
            columns=['disaggregation_value'])
        disaggregations_merged = disaggregations_merged.dropna(
            subset=['parent_period'])
        disaggregations_merged['parent_period'] = disaggregations_merged[
            'parent_period'].astype(int)
        disaggregations_merged['period'] = disaggregations_merged[
            'period'].apply(lambda x: int(float(x)))
        disaggregations_merged['indicator_id'] = disaggregations_merged[
            'indicator_id'].apply(lambda x: int(float(x)))
        disaggregations_merged['type'] = 'Cumulative Actual Values'
        disaggregations_merged['country'] = disaggregations_merged.apply(
            fill_country, axis=1)

        if project_type == 'grand_parent':
            disaggregations_merged['project'] = 'APPSA Zambia'
            disaggregations_merged['commodity'] = disaggregations_merged[
                'commodity'].apply(lambda x: x.replace('-', ' ').title()
                                   if x == x else "")
            disaggregations_merged['commodity'] = disaggregations_merged[
                'commodity'].apply(lambda x: "Country Project"
                                   if x == "" else x)
            disaggregations_merged['country'] = disaggregations_merged.apply(
                fill_country, axis=1)
            disaggregations_merged = disaggregations_merged.drop(
                columns=['project'])

        target_columns = [
            'id', 'value', 'dimension_value', 'period', 'parent_period',
            'indicator_id', 'indicator', 'result_id', 'project_title',
            'project'
        ]
        if len(disaggregation_targets) == 0:
            return None
        targets = pd.DataFrame(disaggregation_targets).fillna(0)
        targets = targets.drop(columns=['id'])
        targets = targets.merge(dimension_values,
                                how='outer',
                                left_on='dimension_value',
                                right_on='id',
                                suffixes=('_target', '_dimension_values'))
        targets = targets.dropna(subset=['parent_period', 'id'])
        targets['has_commodity'] = False
        targets['has_country'] = True
        fill_values = {'value_target': 0}
        targets = targets.fillna(value=fill_values)
        targets['value'] = targets['value_target'].apply(
            lambda x: int(float(x)))
        targets = targets.drop(columns=['value_target'])
        integer_list = [
            'id', 'name', 'parent_dimension_value', 'result', 'parent_period',
            'dimension_value', 'dimension_id', 'period'
        ]
        for ilist in integer_list:
            targets[ilist] = targets[ilist].fillna(0)
        targets[integer_list] = targets[integer_list].astype(int)
        rename_columns = {'value_dimension_values': 'disaggregation_name'}
        unavailable_columns = [
            'disaggregation_value', 'incomplete_data', 'dimension_value',
            'dimension_dimension_name'
        ]
        column_order = [
            x for x in column_order if x not in unavailable_columns
        ]
        column_order = column_order + [
            'value', 'dimension_name', 'dimension_id'
        ]
        targets = targets.rename(columns=rename_columns)[column_order]
        targets['indicator_id'] = targets['indicator_id'].apply(
            lambda x: int(float(x)))
        targets['type'] = 'Y4 RCoLs Targets'
        if project_type == 'grand_parent':
            targets['project'] = 'APPSA Zambia'
            targets['commodity'] = targets['commodity'].apply(
                lambda x: x.replace('-', ' ').title())
            targets['commodity'] = targets['commodity'].apply(
                lambda x: "Country Project" if x == "" else x)
            targets['country'] = targets.apply(fill_country, axis=1)
            targets = targets.drop(columns=['project'])
        else:
            targets['country'] = ''
            targets['country'] = targets.apply(fill_country, axis=1)
            targets['country'] = ''
            targets['country'] = targets.apply(fill_country, axis=1)
        disaggregations_merged = disaggregations_merged.rename(
            columns={'name': 'dimension_id'})
        order_columns = [
            'id', 'result', 'indicator_id', 'dimension_id', 'project_title',
            'indicator', 'dimension_name', 'commodity', 'period', 'country',
            'type', 'value'
        ]
        targets = targets[order_columns]
        disaggregations_merged = disaggregations_merged[order_columns]
        periods_short = pd.DataFrame(periods)
        periods_short = periods_short[[
            'id', 'is_yearly', 'period_start', 'period_end', 'target_value',
            'actual_value', 'indicator_type'
        ]]
        periods_short['period_date'] = periods_short[
            'period_start'] + ' - ' + periods_short['period_end']
        tbl = pd.concat([disaggregations_merged, targets], sort=False)
        tbl = tbl.sort_values(
            by=['result', 'indicator_id', 'dimension_id', 'id'])
        tbl = tbl.merge(periods_short,
                        how='inner',
                        left_on='period',
                        right_on='id',
                        suffixes=('_data', '_period')).sort_values(
                            ['id_data', 'indicator_id', 'dimension_name'])
        remove_columns = ['period_start', 'id_period', 'period', 'is_yearly']
        tbl['cumulative'] = tbl['period_end'].apply(filterEndPeriod)
        tbl = tbl[tbl['cumulative'] == True].drop(
            columns=['cumulative', 'period_end'])
        tbl = tbl.drop(columns=remove_columns)
        if report_type == 'yearly':
            tbl['year'] = tbl['period_date'].apply(lambda x: x.split(' - ')[
                0].split('-')[0] if '-' in x else None)
            tbl = tbl[tbl['year'] == filter_date].drop(
                columns=['year', 'period_date'])
        else:
            tbl = tbl[tbl['period_date'] == filter_date].drop(
                columns=['period_date'])
        order_columns = [
            'result', 'project_title', 'indicator_id', 'indicator_type',
            'indicator', 'dimension_id', 'dimension_name', 'commodity', 'type',
            'country', 'value', 'id_data'
        ]
        tbl = tbl[order_columns]
        tbl_group = [
            'result', 'project_title', 'indicator_id', 'indicator_type',
            'indicator', 'dimension_id', 'dimension_name', 'id_data',
            'commodity', 'country', 'type'
        ]
        tbl_sort = ['result', 'indicator_id', 'dimension_id', 'id_data']
        tbl = tbl.groupby(tbl_group).sum()
        tbl = tbl.unstack('type').unstack('country').sort_values(tbl_sort)
        tbl = tbl.groupby(level=[1, 3, 4, 6, 8], sort=False).sum().astype(int)
        tbl = pd.DataFrame(tbl['value'].to_records())
        tbl = tbl.rename(
            columns={
                "('Cumulative Actual Values', 'Malawi')": "CA-MW",
                "('Cumulative Actual Values', 'Mozambique')": "CA-MZ",
                "('Cumulative Actual Values', 'Zambia')": "CA-ZA",
                "('Y4 RCoLs Targets', 'Malawi')": "TG-MW",
                "('Y4 RCoLs Targets', 'Mozambique')": "TG-MZ",
                "('Y4 RCoLs Targets', 'Zambia')": "TG-ZA"
            })
        tbl['TG-TTL'] = tbl.apply(lambda x: get_total_value(x, 'TG'), axis=1)
        tbl['CA-TTL'] = tbl.apply(lambda x: get_total_value(x, 'CA'), axis=1)
        attr = pd.concat([disaggregations_merged, targets], sort=False)
        attr = attr.sort_values(
            by=['result', 'indicator_id', 'dimension_id', 'id'])
        sort_values = ['id_data', 'indicator_id', 'dimension_name']
        attr = attr.merge(periods_short,
                          how='inner',
                          left_on='period',
                          right_on='id',
                          suffixes=('_data',
                                    '_period')).sort_values(sort_values)
        attr['variable'] = attr.apply(lambda x: {
            'id': x['id_data'],
            'result': x['result'],
            'country': x['country'],
            'type': x['type'],
            'period': x['period'],
            'date': x['period_date'],
            'indicator_id': x['indicator_id'],
            'indicator_type': x['indicator_type'],
            'indicator_name': x['indicator'],
            'dimension': x['dimension_id'],
            'dimension_name': x['dimension_name'],
            'commodity': x['commodity'],
            'value': x['value'],
            'target_value': x['target_value'],
            'actual_value': x['actual_value'],
        },
                                      axis=1)
        attr['cumulative'] = attr['period_end'].apply(filterEndPeriod)
        attr = attr[attr['cumulative'] == True].drop(columns=['cumulative'])
        if report_type == 'yearly':
            attr['year'] = attr['period_date'].apply(
                lambda x: x.split(' - ')[0].split('-')[0])
            attr = attr[attr['year'] == filter_date].drop(
                columns=['year', 'period_date'])
        else:
            attr = attr[attr['period_date'] == filter_date].drop(
                columns=['period_date'])
        attr = attr.drop(
            columns=['period', 'period_start', 'period_end', 'is_yearly'])
        attr_sort = ['result', 'indicator_id', 'dimension_id', 'id_data']
        attr = attr.groupby(tbl_group)['variable'].apply(
            group_attribute).reset_index()
        attr = attr.groupby(tbl_group).first().unstack('type').unstack(
            'country').sort_values(attr_sort)
        attr = attr.groupby(level=[1, 4, 6, 8], sort=False).first()
        attr = pd.DataFrame(attr['variable'].to_records())
        attr = attr.rename(
            columns={
                "('Cumulative Actual Values', 'Malawi')": "CA-MW-D",
                "('Cumulative Actual Values', 'Mozambique')": "CA-MZ-D",
                "('Cumulative Actual Values', 'Zambia')": "CA-ZA-D",
                "('Y4 RCoLs Targets', 'Malawi')": "TG-MW-D",
                "('Y4 RCoLs Targets', 'Mozambique')": "TG-MZ-D",
                "('Y4 RCoLs Targets', 'Zambia')": "TG-ZA-D"
            })
        attr = attr.drop(columns=[
            'project_title', 'indicator', 'commodity', 'dimension_name'
        ])
        merged = pd.merge(tbl, attr, left_index=True, right_index=True)
        merged = merged.replace({np.nan: None})
        merged['CA-TTL-D'] = merged.apply(lambda x: combineList("CA", x),
                                          axis=1)
        merged['TG-TTL-D'] = merged.apply(lambda x: combineList("TG", x),
                                          axis=1)
        try:
            merged['TG-MW-D'] = merged['TG-MW-D'].fillna(merged['CA-MW-D'])
        except:
            merged['TG-MW-D'] = 0
        try:
            merged['TG-MZ-D'] = merged['TG-MZ-D'].fillna(merged['CA-MZ-D'])
        except:
            merged['TG-MZ-D'] = 0
        try:
            merged['TG-ZA-D'] = merged['TG-ZA-D'].fillna(merged['CA-ZA-D'])
        except:
            merged['TG-ZA-D'] = 0
        try:
            merged['CA-MW-D'] = merged['CA-MW-D'].fillna(merged['TG-MW-D'])
        except:
            merged['CA-MW-D'] = 0
        try:
            merged['CA-MZ-D'] = merged['CA-MZ-D'].fillna(merged['TG-MZ-D'])
        except:
            merged['CA-MZ-D'] = 0
        try:
            merged['CA-ZA-D'] = merged['CA-ZA-D'].fillna(merged['TG-ZA-D'])
        except:
            merged['CA-ZA-D'] = 0
        merged['indicator_type'] = merged['indicator_type'].apply(
            lambda x: '#' if x == 1 else '%')
        result_title = list(
            pd.DataFrame(results_framework).groupby(
                'title').first().reset_index()['title'])
        indicator_title = list(
            pd.DataFrame(indicators).groupby('title').first().reset_index()
            ['title'])
        titles = result_title + indicator_title
        return {
            'titles': titles,
            'result_titles': result_title,
            'values': merged.to_dict('records')
        }
