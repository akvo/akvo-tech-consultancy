import os
import sys

from os.path import basename
from datetime import date

import psycopg2 as pg
import pandas.io.sql as psql
import pyminizip
from jinja2 import Environment, FileSystemLoader
from mailjet_rest import Client
import base64

today = date.today()
today_str = today.strftime("%d/%m/%Y")
day = today.strftime('%d')

if (day == '01'):
    POSTGRES_DB = os.environ['POSTGRES_DB']
    POSTGRES_HOST = os.environ['POSTGRES_HOST']
    POSTGRES_PORT = os.environ['POSTGRES_PORT']
    POSTGRES_USER = os.environ['POSTGRES_USER']
    POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']

    MAILJET_APIKEY = os.environ['MAILJET_APIKEY']
    MAILJET_SECRET = os.environ['MAILJET_SECRET']

    EMAIL_RECEIVER = os.environ['EMAIL_RECEIVER'].split(',')
    EMAIL_BCC = os.environ['EMAIL_BCC'].split(',')
    
    mailjet = Client(auth=(MAILJET_SECRET, MAILJET_APIKEY), version='v3.1')

    try:
        connection = pg.connect("dbname='" + POSTGRES_DB + "' user='" + POSTGRES_USER + "' host='" + POSTGRES_HOST + "' password='" + POSTGRES_PASSWORD + "'")
    except:
        print('Unable to connect to the database')


    groups = [
        'Biodiversity Monitoring - Baseline -',
        'Biodiversity Monitoring - Community -',
        'Carbon Monitoring -',
        'Forest Disturbance Monitoring - Baseline -'
    ]

    geo_columns = {
        'Biodiversity Monitoring - Baseline -': {'Take the GPS location': 'point'},
        'Biodiversity Monitoring - Community -': {'Take the GPS location of this place': 'point'},
        'Carbon Monitoring -': {'geographical locations in UTM': 'point'},
        'Forest Disturbance Monitoring - Baseline -': {
            'Take the GPS location': 'point',
            'If the plot is large, take a geoshape/polygon': 'polygon'
        }
    }

    views = {}
    counter = {}

    tmp_dir = './tmp/'
    zip_password = 'nabuflow'

    def get_data(row, group):
        global counter
        geo_str = ', '.join(map(lambda x: 'ST_X("' + x[0] + '") AS "' + x[0] + ' X", ST_Y("' + x[0] + '") AS "' + x[0] + ' Y"' if x[1] == 'point' else 'ST_AsGeoJSON("' + x[0] + '") AS "New ' + x[0] + '"', geo_columns[group].items()))
        print(row)
        try:
            data = psql.read_sql('SELECT *, ' + geo_str + ' FROM "' + row + '"', connection)
            counter[row] = len(data.index)
            # REPLACE GEO COLUMN
            for column, geo_type in geo_columns[group].items():
                if geo_type == 'point':
                    data = data.drop(columns=[column])
                else:
                    data[column] = data['New ' + column]
                    data = data.drop(columns=['New ' + column])

            data.to_csv(tmp_dir + row + '.csv', index=False)
            pyminizip.compress(tmp_dir + row + '.csv', None, tmp_dir + row + '.zip', zip_password, 5)
        except:
            print('Query failed from ' + row, sys.exc_info())

    def send_email(group, files, summary):
        file_loader = FileSystemLoader('.')
        env = Environment(loader=file_loader)
        template = env.get_template('template.html')
        html_output = template.render(
            group = group[:-2],
            today_str = today_str,
            summary = summary
        )

        attach = []
        for f in files.iteritems() or []:
            with open(tmp_dir + f[1], "rb") as fil,  open(tmp_dir + f[1] + ".b64", 'wb') as fout:
                base64.encode(fil, fout)

            with open(tmp_dir + f[1] + ".b64", 'r') as fout:
                attach.append({
                    "ContentType": "application/zip",
                    "Filename": basename(f[1]),
                    "Base64Content": fout.read().rstrip("\n")
                })

        receiver = []
        for email in EMAIL_RECEIVER:
            receiver.append({"Email": email})

        bcc = []
        for email in EMAIL_BCC:
            bcc.append({"Email": email})

        email = {
            'Messages': [{
                        "From": {"Email": "noreply@akvo.org", "Name": "noreply@akvo.org"},
                        "To": receiver,
                        "Bcc": bcc,
                        "Subject": 'Nabu Data - ' + group[:-2] + ' - ' + today_str,
                        "HTMLPart": html_output,
                        "Attachments": attach
                    }]
            }

        result = mailjet.send.create(data=email)
        print('SENDING EMAIL TO {}'.format(', '.join(EMAIL_RECEIVER)))
        print('SENDING EMAIL BCC {}'.format(', '.join(EMAIL_BCC)))
        print('STATUS: {}\n'.format(result.status_code))

    for item in groups:
        data = psql.read_sql("SELECT table_name FROM INFORMATION_SCHEMA.views WHERE table_name LIKE '" + item + "%' ORDER BY table_name ASC", connection)
        data['table_name'].apply(get_data, args=[item])
        files = data['table_name'].apply(lambda x: x + '.zip')
        counter_txt = data['table_name'].apply(lambda x: '<li>' + x + ' : ' + str(counter.get(x, 0)) + ' submission</li>')
        summary = '<ul>' + ''.join(counter_txt) + '</ul>'

        send_email(item, files, summary)
