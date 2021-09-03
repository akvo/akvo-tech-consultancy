import pandas as pd
import os
from util.rsr import Rsr
from util.api import Api

get_data = Api()
rsr = Rsr()

appsa = '7950'
project_parent = rsr.api('project', 'id', "7283")['results'][0]
projects = []
countries = ['Zambia','Malawi','Mozambique']
directory = './cache/rf/'
if not os.path.exists(directory):
    os.makedirs(directory)
cache = './cache/rf/' + appsa + '.json'
if not os.path.exists(cache):
    get_data.api_results_framwork(appsa)
period_list = rsr.readcache(cache).get('period_list')
for p in ["7283","7950"]:
    project = rsr.api('project', 'id', p)['results'][0]

countries = ["Zambia", "Malawi", "Mozambique"]
get_data.datatable("7282", "grand_parent", "yearly", "2015", countries)
get_data.datatable("7950", "parent", "yearly", "2015", countries)
