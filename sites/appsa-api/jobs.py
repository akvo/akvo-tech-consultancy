import pandas as pd
import os
import threading
from util.rsr import Rsr
from util.api import Api

get_data = Api()
rsr = Rsr()


def process(ids, start, end):
    for id in ids[start:end]:
        try:
            rsr.queue("results_framework", "project", id)
        except Exception:
            print('error with id')


def split_processing(items, num_splits=4):
    split_size = len(items) // num_splits
    threads = []
    for i in range(num_splits):
        start = i * split_size
        end = None if i + 1 == num_splits else (i + 1) * split_size
        threads.append(
            threading.Thread(target=process, args=(items, start, end)))
        threads[-1].start()
    for t in threads:
        t.join()


def cache_all(project_id, project_type):
    related_project = rsr.queue('related_project', 'related_project',
                                project_id)
    if project_type == 'parent':
        project_list = list(
            pd.DataFrame(related_project['results'])['project'])
    if project_type == 'grand_parent':
        parent_list = list(pd.DataFrame(related_project['results'])['project'])
        project_list = []
        for second_level in parent_list:
            second_list = rsr.queue('related_project', 'related_project',
                                    second_level)
            try:
                second_list = list(
                    pd.DataFrame(second_list['results'])['project'])
                for third_level in second_list:
                    project_list.append(third_level)
            except:
                pass
    if project_type == 'child':
        rsr.queue('results_framework', 'project', project_id)
    if project_type == 'parent':
        split_processing(project_list)
    if project_type == 'grand_parent':
        split_processing(project_list)


appsa = '7950'
rsr.queue('project', 'id', "7283")['results'][0]
countries = ['Zambia', 'Malawi', 'Mozambique']
directory = './cache/rf/'
if not os.path.exists(directory):
    os.makedirs(directory)
cache = f"./cache/rf/{appsa}.json"
if not os.path.exists(cache):
    get_data.api_results_framwork(appsa)
for p in [7283, 7950]:
    rsr.queue('project', 'id', p)

countries = ["Zambia", "Malawi", "Mozambique"]
for p in [7282, 7950]:
    related_project = rsr.queue('related_project', 'related_project', p)
cache_all(7282, "grand_parent")
cache_all(7950, "parent")
