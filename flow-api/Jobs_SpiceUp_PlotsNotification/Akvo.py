import requests as r
import os
import logging

class Flow:

    def getAccessToken():
        tokenURI = 'https://akvo.eu.auth0.com/oauth/token'
        auth = {
            "client_id": os.environ['AUTH0_CLIENT_ID'],
            "username": os.environ['AUTH0_EMAIL'],
            "password": os.environ['AUTH0_PWD'],
            "grant_type": "password",
            "scope": "openid email",
        }

        try:
            account = r.post(tokenURI, data=auth).json();
        except:
            logging.error('FAILED TO REQUEST TOKEN')
            return False
        return account['id_token']

    def getResponse(self, token):
        headers = {
            "Content-Type":"application/json",
            "Accept": "application/vnd.akvo.flow.v2+json",
            "Authorization": "Bearer {}".format(token)
        }
        response = r.get(self, headers=headers)
        if response.status_code == 200:
            return response.json()
        return False
