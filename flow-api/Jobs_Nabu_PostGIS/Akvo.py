import os
import sys

import requests as r


class Flow:
    tokenURI = 'https://akvotest.eu.auth0.com/oauth/token'
    rtData = {
        'client_id': 'qsxNP3Nex0wncADQ9Re6Acz6Fa55SuU8',  # flow-api @ akvotest
        'username': os.environ['AUTH0_USER'],
        'password': os.environ['AUTH0_PWD'],
        'grant_type': 'password',
        'scope': 'openid email'
    }

    @staticmethod
    def get_access_token():
        try:
            tokens = r.post(Flow.tokenURI, Flow.rtData).json();
        except:
            sys.stderr.write('Failed to obtain token')
            return False
        return tokens['access_token']

    @staticmethod
    def get_response(url):
        header = {
            'Authorization': 'Bearer ' + Flow.get_access_token(),
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent': 'python-requests/2.14.2'
        }
        response = r.get(url, headers=header).json()
        return response
