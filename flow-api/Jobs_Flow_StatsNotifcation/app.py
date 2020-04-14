from __future__ import print_function
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from datetime import datetime
import os

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = '1Ky2mBIeqan3yhGexwdZAW0c7TRdkK8H2_xyr-cyd7fc'
RANGE_NAME = 'Notifications!A1:O100'
FILENAME = datetime.now()
FILENAME = FILENAME.strftime("%Y-%m-%d")
FOLDERNAME = "./data"
FILENAME = "{}/report-{}.csv".format(FOLDERNAME, FILENAME)

def main():
    creds = None
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('sheets', 'v4', credentials=creds)
    sheet = service.spreadsheets()
    result = sheet.values().get(spreadsheetId=SPREADSHEET_ID,
                                range=RANGE_NAME).execute()
    values = result.get('values', [])

    if not values:
        print('No data found.')
    else:
        if not os.path.exists(FOLDERNAME):
            os.mkdir(FOLDERNAME)
        if os.path.exists(FILENAME):
            os.remove(FILENAME)
            open(FILENAME, 'w').close()
        for row in values:
            with open(FILENAME, 'a') as output:
                data = []
                for k in row:
                    k = "|".join(k.splitlines())
                    k = k.replace("#N/A","")
                    data.append(k)
                line = ",".join(data)
                output.write('{}\n'.format(line))

if __name__ == '__main__':
    main()
