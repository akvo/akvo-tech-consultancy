import pickle
import os.path
import smtplib
import pandas as pd
import sys
import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = '1c0JtibjTgnfwQ1EcVmEVJJiRG9tjFEhSG_Twrj-0WVU'
RANGE_NAME = 'Notifications!A1:P100'
FILENAME = datetime.now()
FILENAME = FILENAME.strftime("%Y-%m-%d")
FOLDERNAME = "./data"
FILENAME = "{}/report-{}.csv".format(FOLDERNAME, FILENAME)
EMAIL_USER = os.environ["TC_EMAIL"]
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PWD = os.environ["TC_EMAIL_PWD"]

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

data = pd.read_csv(FILENAME)
today = datetime.now().strftime("%Y-%m-%d")

def dateformat(a):
    return datetime.strptime(a, '%d-%b-%Y').strftime("%Y-%m-%d")

def readabledate(a):
    return datetime.strptime(a, '%d-%b-%Y').strftime("%d %B %Y")

data['flow_usage'] = data['flow_usage'].fillna(0).astype('int')
data['contract_notif_date'] = data['contract_notif_date'].apply(dateformat)
data['expired_date_p'] = data['expired_date'].apply(readabledate)
data['contract_notif_date'] = pd.to_datetime(data['contract_notif_date'], format='%Y-%m-%d')
data['lumen'] = data['lumen'].apply(lambda x: x if x == x else None)
notification = data[data['contract_notif_date'] == today]
notification = notification.dropna(subset=['name', 'email'])
test = ["Deden Bangkit","Jana (Janka) Gombitova"]
notification["send"] = notification.apply(lambda x: True if x["name"] in test else False, axis=1)
test = notification[notification["send"] == True].to_dict("records")

def send_email(data):
    project = data["project_name"].lower().title()
    expired = "expiring" if data['email_issue'] == "EXPIRED" else "expiring"
    expired = "{} per <strong>{}</strong>".format(expired,data["expired_date_p"])
    summary = "Your {}'s contract is {}. The {} has 1 Akvo Flow Instance".format(
        project,expired,project,project,project.lower()
    )
    lumen = data["lumen"]
    instances = 2
    if lumen == None:
        lumen = False
        instances = 1
        summary = summary + "."
    if lumen != False:
        summary = summary + " and 1 Lumen Instance."
    summary = {
        "intro":"How are you doing in {}?".format(data['hubs']),
        "summary":summary,
        "outro":"Please get in touch with your partner to discuss the renewal of the contract."
    }
    flow = {
        "name":data['project_name'],
        "usage":data['flow_usage'],
        "datapoints": data['flow_usage']* data['flow_limit'] *10,
        "remaining": data['flow_remaining'],
        "limit":data['limit_notification']
    }
    file_loader = FileSystemLoader('.')
    env = Environment(loader=file_loader)
    template = env.get_template('template.html')
    html_output = template.render(
        instances = instances,
        name = "Hi {},".format(data['name'].split(" ")[0]),
        summary = summary,
        flow = flow,
        lumen = lumen
    )
    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'DO NOT REPLY - Notification contract of {}'.format(data['project_name'].title())
    msg['To'] = data['email']
    msg['From'] = EMAIL_USER
    print('SENDING EMAIL TO {}'.format(data['email']))
    msg.attach(MIMEText(html_output, 'html'))
    try:
        with smtplib.SMTP(EMAIL_HOST, 587) as s:
            s.ehlo()
            s.starttls()
            s.ehlo()
            s.login(EMAIL_USER, EMAIL_PWD)
            s.send_message(msg)
            s.quit()
        print('EMAIL SENT\n')
    except:
        print('UNABLE TO SEND THE EMAIL. ERROR:{}\n'.format(sys.exc_info()[0]))
        raise

for t in test:
    send_email(t)

