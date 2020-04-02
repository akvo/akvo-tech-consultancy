import os
import smtplib
import sys
from os.path import basename
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
from datetime import date

import psycopg2 as pg
import pandas.io.sql as psql
import pyminizip
from jinja2 import Environment, FileSystemLoader

EMAIL_USER = os.environ['EMAIL_USER']
EMAIL_HOST = os.environ['EMAIL_HOST']
EMAIL_PWD = os.environ['EMAIL_PWD']

POSTGRES_DB = os.environ['POSTGRES_DB']
POSTGRES_HOST = os.environ['POSTGRES_HOST']
POSTGRES_PORT = os.environ['POSTGRES_PORT']
POSTGRES_USER = os.environ['POSTGRES_USER']
POSTGRES_PASSWORD = os.environ['POSTGRES_PASSWORD']

EMAIL_RECEIVER = ['Stefanie.Brandes@NABU.de', 'Svane.Bender@NABU.de', 'Mesfin.Tekle.nabu@gmail.com']
EMAIL_BCC = ['joy@akvo.org','deden@akvo.org']

today = date.today()
today_str = today.strftime("%d/%m/%Y")

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

    msg = MIMEMultipart('alternative')
    msg['Subject'] = 'Nabu Data - ' + group[:-2] + ' - ' + today_str
    msg['To'] = ', '.join(EMAIL_RECEIVER)
    msg['From'] = EMAIL_USER
    msg['Bcc'] = ','.join(EMAIL_BCC)

    print('SENDING EMAIL')
    # fout = "./template.html"
    msg.attach(MIMEText(html_output, 'html'))
    for f in files.iteritems() or []:
        with open(tmp_dir + f[1], "rb") as fil:
            part = MIMEApplication(
                fil.read(),
                Name=basename(f[1])
            )
        # After the file is closed
        part['Content-Disposition'] = 'attachment; filename="%s"' % basename(f[1])
        msg.attach(part)

    try:
        with smtplib.SMTP(EMAIL_HOST, 587) as s:
                s.ehlo()
                s.starttls()
                s.ehlo()
                s.login(EMAIL_USER, EMAIL_PWD)
                s.send_message(msg)
                s.quit()
        print('EMAIL SENT')
    except:
        print('UNABLE TO SEND THE EMAIL. ERROR:', sys.exc_info()[0])
        raise

for item in groups:
    data = psql.read_sql("SELECT table_name FROM INFORMATION_SCHEMA.views WHERE table_name LIKE '" + item + "%' ORDER BY table_name ASC", connection)
    data['table_name'].apply(get_data, args=[item])
    files = data['table_name'].apply(lambda x: x + '.zip')
    counter_txt = data['table_name'].apply(lambda x: '<li>' + x + ' : ' + str(counter.get(x, 0)) + ' submission</li>')
    summary = '<ul>' + ''.join(counter_txt) + '</ul>'

    send_email(item, files, summary)
