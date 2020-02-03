import requests as r
import logging
from os import environ
from time import time
from resources.models import Sync

class flow_api():

    data = {
        'client_id':'curl',
        'username': environ['KEYCLOAK_USER'],
        'password': environ['KEYCLOAK_PWD'],
        'grant_type':'password',
        'scope':'openid offline_access'
    }

    auth_url = 'https://login.akvo.org/auth/realms/akvo/protocol/openid-connect/token'
    data_url = 'https://api.akvo.org/flow/orgs/'

    def refresh_token(self):
        tokens = r.post(self.auth_url, self.data).json();
        return tokens['refresh_token']

    def get_new_token(self):
        account = {
            'client_id':'curl',
            'refresh_token': self.refresh_token(),
            'grant_type':'refresh_token'
        }
        try:
            account = r.post(self.auth_url, account).json();
        except:
            logging.error('FAILED: TOKEN ACCESS UNKNOWN')
            return False
        return {'token': account['access_token'], 'time':time()}

    def check_token(self, token):
        delta = time() - token['time']
        fetch = True if delta < 300 else False
        fetch = True if token == False else True
        if fetch:
            return self.get_new_token()
        return {'token':token['token'], 'time':token['time']}

    def get_data(self, url, token):
        header = {
            'Authorization':'Bearer ' + token['token'],
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        }
        response = r.get(url, headers=header).json()
        return response

    def get_instance_url(self, instance_id):
        return  self.data_url + instance_id

class flow_sync():

    data = {
        'client_id':'qsxNP3Nex0wncADQ9Re6Acz6Fa55SuU8',
        'username': environ['AUTH0_USER'],
        'password': environ['AUTH0_PWD_TEST'],
        'grant_type':'password',
        'scope':'openid email'
    }

    auth_url = 'https://akvotest.eu.auth0.com/oauth/token'
    data_url = 'https://api-auth0.akvotest.org/flow/orgs/'
    cursor_url = 'https://api-auth0.akvotest.org/flow/orgs/uat2/sync'

    def get_token(self):
        try:
            account = r.post(self.auth_url, self.data).json();
        except:
            logging.error('FAILED: TOKEN ACCESS UNKNOWN')
            return False
        return {'token': account['id_token'], 'time':time()}

    def init_data(self, session, instance_id, token):
        init_url = '{}{}/sync?initial=true'.format(self.data_url, instance_id)
        header = {
            'Authorization':'Bearer ' + token['token'],
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'User-Agent':'python-requests/2.14.2'
        }
        response = r.get(init_url, headers=header)
        data = response.json()
        data.update({'status':response.status_code})
        self.cursor_save(session, data)
        return data

    def cursor_save(self, session, data):
        next_sync = data['nextSyncUrl']
        cursor_sync = Sync(next_sync.split('=')[-1], [])
        session.add(cursor_sync)
        session.commit()
        print("NEW CURSOR SAVED")
        return cursor_sync

    def cursor_update(self, session, data):
        current_sync = self.cursor_get(session)
        current_sync_id = current_sync.split('=')[-1]
        current_sync = session.query(Sync).filter(Sync.url == current_sync_id).first()
        current_sync.data = data['changes']
        session.add(current_sync)
        session.commit()
        print("CURSOR UPDATED")
        return self.cursor_save(session, data)

    def cursor_get(self, session):
        cursor = session.query(Sync).order_by(Sync.id.desc()).first()
        endpoint = '{}?next=true&cursor={}'.format(self.cursor_url, str(cursor.url))
        return endpoint

    def get_history(self, session):
        last_sync = session.query(Sync).order_by(Sync.id.desc()).limit(2)
        last_sync = last_sync[-1]
        return last_sync

    def get_data(self, session, url, token):
        header = {
            'Authorization':'Bearer ' + token['token'],
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'Content-Type':'application/json'
        }
        response = r.get(url, headers=header)
        if response.status_code == 200:
            data = response.json()
            self.cursor_update(session, data)
            data.update({'status':200})
            return data
        return {'status': 204, 'nextSyncUrl':url}
