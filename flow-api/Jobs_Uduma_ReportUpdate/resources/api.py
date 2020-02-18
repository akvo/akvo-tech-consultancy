import requests as r
import logging
from os import environ
from time import time
from resources.models import Sync

class flow_api():

    data = {
        'client_id': environ['AUTH0_CLIENT'],
        'username': environ['AUTH0_USER'],
        'password': environ['AUTH0_PWD'],
        'grant_type':'password',
        'scope':'openid email'
    }

    auth_url = 'https://akvofoundation.eu.auth0.com/oauth/token'
    data_url = 'https://api-auth0.akvo.org/flow/orgs/udumamali'

    def get_token(self):
        account = r.post(self.auth_url, self.data);
        try:
            account = account.json();
        except:
            logging.error('FAILED: TOKEN ACCESS UNKNOWN')
            return False
        return {'token': account['id_token'], 'time':time()}

    def get_header(self, token):
        return {
            'Authorization':'Bearer ' + token['token'],
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'Content-Type':'application/json'
        }

    def check_folders(self, foldersUrl, surveysUrl, token):
        folder_depth = self.get_data(foldersUrl, token)['folders']
        if len(folder_depth) > 0:
            for df in folder_depth:
                surveysUrl.append(df['surveysUrl'])
                self.check_folder(df, surveysUrl, token)
        else:
            return surveysUrl

    def get_data(self, url, token):
        header = self.get_header(token)
        response = r.get(url, headers=header)
        url = url.replace(self.data_url, '')
        logging.warn("FETCH: " + str(response.status_code) + " | " + url)
        if response.status_code == 200:
            response = response.json()
            return response
        logging.error("ERROR: " + url.replace(self.data_url, ''))
        return response

    def sync_data(self, session, url, token):
        header = self.get_header(token)
        response = r.get(url, headers=header)
        if response.status_code == 200:
            data = response.json()
            data.update({'status':200})
            return data
        if response.status_code == 204:
            return {'status': 204, 'nextSyncUrl':url}

    def init_sync(self, session, token):
        init_url = '{}/sync?initial=true'.format(self.data_url)
        header = self.get_header(token)
        response = r.get(init_url, headers=header)
        logging.warn(response.status_code)
        if response.status_code != 200:
            logging.warn(response.text)
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
        current_sync.data = data
        session.add(current_sync)
        session.commit()
        print("CURSOR UPDATED")
        return self.cursor_save(session, data)

    def cursor_get(self, session):
        cursor = session.query(Sync).order_by(Sync.id.desc()).first()
        endpoint = '{}/sync?next=true&cursor={}'.format(self.data_url, str(cursor.url))
        return endpoint

    def get_history(self, session):
        last_sync = session.query(Sync).order_by(Sync.id.desc()).limit(2)
        last_sync = last_sync[-1]
        return last_sync

