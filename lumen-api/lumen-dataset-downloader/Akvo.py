import requests as r
import os

class Flow:
    def getToken():
        authentification = {
            'client_id':'curl',
            'username': os.environ['KEYCLOAK_USER'],
            'password': os.environ['KEYCLOAK_PWD'],
            'grant_type':'password',
        }
        tokenURI = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
        tokens = r.post(tokenURI, authentification).json()
        return tokens['access_token']

    def getData(self, accessToken):
        response = r.get(self, headers={
            'Authorization':'Bearer ' + accessToken,
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        })
        return response.json()

    def postData(self, accessToken):
        response = r.post(self, headers={
            'Authorization':'Bearer ' + accessToken,
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        })
        return response.json()
