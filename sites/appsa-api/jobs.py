import pandas as pd
import os
from util.rsr import Rsr
from util.api import Api

get_data = Api()
rsr = Rsr()


def trace_onechildren(list_id):
    for pid in list_id:
        rsr.api('results_framework', 'project', pid)


def no_trace(project_id):
    rsr.api('results_framework', 'project', project_id)


def cache_all(project_id, project_type):
    related_project = rsr.api('related_project', 'related_project', project_id)
    if project_type == 'parent':
        project_list = list(
            pd.DataFrame(related_project['results'])['project'])
    if project_type == 'grand_parent':
        parent_list = list(pd.DataFrame(related_project['results'])['project'])
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
    if project_type == 'child':
        results_framework = no_trace(project_id)
    if project_type == 'parent':
        results_framework = trace_onechildren(project_list)
    if project_type == 'grand_parent':
        results_framework = trace_onechildren(project_list)


appsa = '7950'
rsr.api('project', 'id', "7283")['results'][0]
countries = ['Zambia', 'Malawi', 'Mozambique']
directory = './cache/rf/'
if not os.path.exists(directory):
    os.makedirs(directory)
cache = f"./cache/rf/{appsa}.json"
if not os.path.exists(cache):
    get_data.api_results_framwork(appsa)
for p in [7283, 7950]:
    rsr.api('project', 'id', p)

countries = ["Zambia", "Malawi", "Mozambique"]
for p in [7282, 7950]:
    related_project = rsr.api('related_project', 'related_project', p)
cache_all(7282, "grand_parent")
cache_all(7950, "parent")
