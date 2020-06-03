import pickle
import os.path
import pandas as pd
import sys
import os
from datetime import datetime
from mailjet_rest import Client
from jinja2 import Environment, FileSystemLoader
from googleapiclient.discovery import build
from google.auth.transport.requests import Request

SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']
SPREADSHEET_ID = '1c0JtibjTgnfwQ1EcVmEVJJiRG9tjFEhSG_Twrj-0WVU'
RANGE_NAME = 'Notifications!A1:P100'
FILENAME = datetime.now()
FILENAME = FILENAME.strftime("%Y-%m-%d")
FOLDERNAME = "./data"
FILENAME = "{}/report-{}.csv".format(FOLDERNAME, FILENAME)
MAILJET_APIKEY = os.environ["MAILJET_APIKEY"]
MAILJET_SECRET = os.environ["MAILJET_SECRET"]
GOOGLE_TOKEN = 'token.pickle'

mailjet = Client(auth=(MAILJET_SECRET, MAILJET_APIKEY), version='v3.1')
notification_test = ["Deden Bangkit"]
production = True
command = False

def get_args(cmd):
    if cmd == "--limit":
        return "limit"
    if cmd == "--contract":
        return "contract"
    return False

def error_args():
    print("\nUSAGE:\n")
    print("python app.py --limit")
    print("python app.py --contract\n")
    sys.exit(0)

if len(sys.argv) == 2:
    command = get_args(sys.argv[1])
if command == False:
    error_args()
if len(sys.argv) < 2 or len(sys.argv) > 2:
    error_args()

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
    template = env.get_template('./template/contract-notification.html')
    html_output = template.render(
        instances = instances,
        name = "Hi {},".format(data['name'].split(" ")[0]),
        summary = summary,
        flow = flow,
        lumen = lumen,
        now = datetime.strftime(datetime.now(),"%Y%m%d")
    )
    email = {
        'Messages': [{
                    "From": {"Email": "noreply@akvo.org","Name": "noreply@akvo.org"},
                    "To": [{
                        "Email": data["email"],
                        "Name": data["name"]
                    }],
                    "Subject": 'DO NOT REPLY - Notification contract of {}'.format(data['project_name'].title()),
                    "TextPart":"Testing",
                    "HTMLPart": html_output
                    }
                ]
        }
    result = mailjet.send.create(data=email)
    print('SENDING EMAIL TO {}'.format(data['email']))
    print('STATUS: {}\n'.format(result.status_code))

def dateformat(a):
    return datetime.strptime(a, '%d-%b-%Y').strftime("%Y-%m-%d")

def readabledate(a):
    return datetime.strptime(a, '%d-%b-%Y').strftime("%d %B %Y")


creds = None
if os.path.exists(GOOGLE_TOKEN):
    with open(GOOGLE_TOKEN, 'rb') as token:
        creds = pickle.load(token)
if creds and creds.expired and creds.refresh_token:
    creds.refresh(Request())
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)
if not creds or not creds.valid:
    print("GDrive: Token Error")
    sys.exit(0)

service = build('sheets', 'v4', credentials=creds)
sheet = service.spreadsheets()
result = sheet.values().get(spreadsheetId=SPREADSHEET_ID, range=RANGE_NAME).execute()
values = result.get('values', [])

if not values:
    print('NO DATA AVAILABLE')
    sys.exit(0)
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
data['flow_usage'] = data['flow_usage'].fillna(0).astype('int')
data['contract_notif_date'] = data['contract_notif_date'].apply(dateformat)
data['expired_date_p'] = data['expired_date'].apply(readabledate)
data['contract_notif_date'] = pd.to_datetime(data['contract_notif_date'], format='%Y-%m-%d')
data['lumen'] = data['lumen'].apply(lambda x: x if x == x else None)
data = data.dropna(subset=['name', 'email'])
if production:
    notifications = data[data['contract_notif_date'] == today]
    # second
    notifications = data[data['days_left'] > 0]]
else:
    data["send"] = data.apply(lambda x: True if x["name"] in notification_test else False, axis=1)
    notifications = data[data["send"] == True]

notifications = notifications.to_dict("records")
if (len(notifications) == 0):
    print("NO NOTIFICATION FOR TODAY ... EXITING")
    sys.exit(0)

for notification in notifications:
    send_email(notification)
