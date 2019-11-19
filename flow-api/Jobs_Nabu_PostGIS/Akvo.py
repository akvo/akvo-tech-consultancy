import requests as r
import os, sys

class Flow:
    tokenURI = 'https://akvotest.eu.auth0.com/oauth/token'
    rtData = {
        'client_id':'qsxNP3Nex0wncADQ9Re6Acz6Fa55SuU8', # flow-api @ akvotest
        'username': os.environ['AUTH0_USER'],
        'password': os.environ['AUTH0_PWD'],
        'grant_type':'password',
        'scope':'openid email'
    }


    def getAccessToken():
        try:
            tokens = r.post(Flow.tokenURI, Flow.rtData).json();
        except:
            logging.error('Failed to obtain token')
            return False
        return account['access_token']

    def getResponse(self):
        header = {
            'Authorization':'Bearer ' + Flow.getAccessToken(),
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        }
        response = r.get(self, headers=header).json()
        return response
