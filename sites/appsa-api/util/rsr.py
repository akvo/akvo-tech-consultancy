from util.util import Printer
import json
import requests
import os

printer = Printer()

## Static Variables

TEST_URL = 'https://rsr.test.akvo.org/rest/v1/'
TOKEN = os.environ['RSR_TOKEN'].replace('\n','')
PROD_URL  = 'https://rsr.akvo.org/rest/v1/'
FMT = '/?format=json&limit=1'
FMT100 = '/?format=json&limit=100'

headers = {
    'content-type': 'application/json',
    'Authorization': TOKEN
}


class Rsr:

    def __init__(self):
        self.project_id = '7950' # '7283'
        self.result_framework = ['results_framework']

    def readcache(self, filename):
        print(printer.get_time() + ' :: READING CACHE - ' + filename)
        with open(filename, 'r') as f:
            data = json.load(f)
        return data

    def api(self, endpoint, param, value):
        self.endpoint = endpoint
        self.param = param
        self.value = value
        directory = './cache/' + endpoint + '/' + param
        filename = directory + '/' + str(value) + '.json'
        if not os.path.exists(directory):
            os.makedirs(directory)
        if not os.path.exists(filename):
            URL = PROD_URL
            uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
            print(printer.get_time() + ' :: FETCH RSR - ' + uri)
            data = requests.get(uri, headers=headers)
            data = data.json()
            with open(filename, 'w') as outfile:
                json.dump(data, outfile)
        data = self.readcache(filename)
        return data
