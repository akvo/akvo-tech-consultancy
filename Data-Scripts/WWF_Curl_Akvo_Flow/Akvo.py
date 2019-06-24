import requests as r
import os

class Flow:
    tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
    rtData = {
        'client_id':'curl',
        'username': os.environ['KEYCLOAK_USER'],
        'password': os.environ['KEYCLOAK_PWD'],
        'grant_type':'password',
        'scope':'openid offline_access'
    }

    def refreshData():
        tokens = r.post(Flow.tokenURI, Flow.rtData).json();
        return tokens['refresh_token']

    def getAccessToken():
        account = {
            'client_id':'curl',
            'refresh_token': Flow.refreshData(),
            'grant_type':'refresh_token'
        }
        try:
            account = r.post(Flow.tokenURI, account).json();
        except:
            print('FAILED: TOKEN ACCESS UNKNOWN')
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
