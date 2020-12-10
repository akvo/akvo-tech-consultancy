import json
import requests

## Static Variables

TOKEN = 'Token 7d9a17639015b614a8026868dcc0f90fe38a4268'
URL  = 'https://rsr.akvo.org/rest/v1/'
FMT100 = '/?format=json&limit=100'

headers = {
    'content-type': 'application/json',
    'Authorization': TOKEN
}


class Rsr:

    def __init__(self):
        self.project_id = '7950' # '7283'
        self.result_framework = ['results_framework']

    def read(self, filename):
        with open(filename, 'r') as f:
            data = json.load(f)
        return data

    def api(self, endpoint, param, value):
        uri = '{}{}{}&{}={}'.format(URL, endpoint, FMT100, param, value)
        print(uri)
        response = requests.get(uri, headers=headers)
        data = response.json()
        
        return data
