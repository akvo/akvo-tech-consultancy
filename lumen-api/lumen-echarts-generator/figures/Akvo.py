import requests as r
import os

class Flow:
    def getToken():
        authentification = {
            'client_id':'curl',
            'username': os.environ['AUTH0_USER'],
            'password': os.environ['AUTH0_PWD'],
            'grant_type':'password',
            'audience': 'https://akvofoundation.eu.auth0.com/api/v2/',
            'scope': 'openid profile email',
	    'client_id': 'KOgRM2Uam6FXOZdwKs3AKU7I8VtGKsiu',
	    'client_secret': os.environ['AUTH0_CLIENT_PASSWORD'],
        }
        tokenURI = 'https://akvofoundation.eu.auth0.com/oauth/token'
        tokens = r.post(tokenURI, authentification).json()
        return tokens['id_token']

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
