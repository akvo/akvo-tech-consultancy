import requests as r
import os

class Flow:
    tokenURI = 'https://akvo.eu.auth0.com/oauth/token'
    rtData = {
        'client_id': os.environ['AUTH0_CLIENT'],
        'username': os.environ['AUTH0_USER'],
        'password': os.environ['AUTH0_PWD'],
        'grant_type':'password',
        'scope':'openid email'
    }

    def getToken():
        tokens = r.post(Flow.tokenURI, Flow.rtData)
        if tokens.status_code == 200:
            tokens = tokens.json()
            return tokens['id_token']
        return "Error"

    def getResponse(self, token):
        header = {
            'Authorization':'Bearer ' + token,
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'Content-Type': 'application/json',
        }
        response = r.get(self, headers=header).json()
        return response
