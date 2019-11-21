from datetime import datetime
import time
from Akvo import Flow
from FlowHandler import FlowHandler
import pandas as pd
import json

pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)

instanceURI = 'nabu'
requestURI = 'https://api-auth0.akvotest.org/flow/orgs/' + instanceURI

start_time = time.time()
date_format = '%Y-%m-%dT%H:%M:%SZ'


def check_time(x):
    total_time = x - start_time
    spent = time.strftime("%H:%M:%S", time.gmtime(total_time))
    return spent


def file_date():
    return datetime.now().strftime("_%Y_%m_%d_%H%M")


def details(x):
    return [{'id': a['id'], 'name': a['name'].replace(' ', '_'), 'type': a['type']} for a in x]


def questions(x):
    return [{'id': a['id'], 'name': a['name'], 'questions': details(a['questions'])} for a in x]


def get_all(url, data_points):
    data_points = data_points
    data = Flow.get_response(url)
    form_instances = data.get('formInstances')
    try:
        for dataPoint in form_instances:
            data_points.append(dataPoint)
        print(check_time(time.time()) + ' GET DATA FROM[' + url + ']')
        url = data.get('nextPageUrl')
        get_all(url, data_points)
    except:
        print(check_time(time.time()) + ' DOWNLOAD COMPLETE')
    return data_points


def get_data(survey_definition):
    forms = survey_definition.get('forms')
    all_responses = {}
    for form in forms:
        question_groups = questions(form['questionGroups'])
        metas = pd.DataFrame(question_groups)
        form_uri = form['formInstancesUrl']
        data_points = get_all(form_uri, [])
        output = pd.DataFrame(data_points)
        all_groups = {}
        for index, questionGroup in enumerate(question_groups):
            group_id = questionGroup['id']
            metadata = metas['questions'][index]
            print(check_time(time.time()) + ' TRANSFORMING')
            for qst in metadata:
                q_name = qst['name'].replace('_', ' ')
                q_id = str(qst['id'])
                q_type = qst['type']
                try:
                    output[q_name] = output['responses'].apply(lambda x: FlowHandler(x[group_id], q_id, q_type))
                    if q_type == 'GEO':
                        output[q_name + '_lat'] = output[q_name].apply(lambda x: x[0] if x is not None else x)
                        output[q_name + '_long'] = output[q_name].apply(lambda x: x[1] if x is not None else x)
                        output = output.drop([q_name], axis=1)
                except:
                    pass
            try:
                output = output.drop(['responses'], axis=1)
            except:
                pass
            all_groups.update({questionGroup['name']: output.to_dict('records')})
        all_responses.update({form['name']: all_groups})
    return all_responses


def parse_json(data):
    data = data.replace("'", '"')
    import json
    j1 = json.loads(data)
    return j1


def get_code_val(s, i, d):
    if s is None:
        return d.split(':')[1]
    else:
        return d.split(s)[i].split(':')[1]


def get_address(x):
    p_address = get_code_val('|', 3, x).title() + ', ' + get_code_val('|', 2, x).title() + ', '
    p_address += get_code_val('|', 1, x).title() + ', ' + get_code_val('|', 0, x).title()
    return p_address


carbon_monitor_survey = Flow.get_response(requestURI + '/surveys/40050001')
carbon_monitor_data = get_data(carbon_monitor_survey)

with open("/tmp/carbon-data.json", "w") as f:
    f.write(json.dumps(carbon_monitor_data))

