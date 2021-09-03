Class results_framework:

    def indicators(data):


    def results_framwork_api(self):
        results_framework = get_response(self,'results_framework','project',PROJECT_ID)['results']

        indicators = []
        periods = []
        dimension_names = []
        dimension_values = []

        for result_framework in results_framework:
            rf_id = {'result':result_framework['id']}
            for indicator in result_framework['indicators']:
                indicator_id = indicator['id']

                for period in indicator['periods']:
                    is_yearly = get_report_type(period['period_start'],period['period_end'])
                    period.update(is_yearly)
                    period.update(rf_id)
                    period.update({'indicator':indicator_id})
                    periods.append(period)
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

