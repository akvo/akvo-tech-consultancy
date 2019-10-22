from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from lxml import etree
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
from datetime import datetime
import pandas as pd
import requests as r
import sqlite3
import xmltodict
import json
import os
import ast

app = Flask(__name__)
CORS(app)
instance_list = './data/flow-survey-amazon-aws.csv'

pk = "_pk_id.10.68e2"
pk_id = "03f2911e2c9d84d1.1568611861.10.1571720734.1571720734."
session_id = "Ak26L25N75CI6iTcd90vjQ"
sacsid= "~AJKiYcHzULM1QxaelSIE5-jcfe-TLKBtIBcrKQSO-ArGXN-FPH0SmbEazxE54OPLPxF1GMvKXNbZUuQrLcdGwnTSyz9AiYZRsqUSBNS8ooiycR7RSTIkQvrGZQR7PbjgWHupo2gy9bZndvxJflooD2lfKnXpyBgCBRqDF-nKxSVhIE912VYlDC0SFRpvLGoVS9A-DnU11oNkAMWZsxrAwNALQv3GFUJjZkFPpHqLvg0lbBcUTOXYiPWHFdHl5fIfjgkWX-zKC-Fufj5GueC17Yaje5pqw-kuhoullQ36iIbVVlLwG3mddEIKUoEP1wztp4RCfJtRukUP"
posturl = "https://dev3.akvoflow.org/rest/form_instances"

header = {
    'Accept': "application/json, text/javascript, */*; q=0.01",
    'Content-Type': "application/json",
    'Cookie': pk + "=" + pk_id + "; JSESSIONID=" + session_id + ";SACSID=" + sacsid + ";",
    'cache-control': "no-cache",
}

def readxml(xmlpath):
    with open(xmlpath) as survey:
        encoding = etree.parse(survey)
        encoding = encoding.docinfo.encoding
    with open(xmlpath) as survey:
        survey = xmltodict.parse(survey.read(),encoding=encoding,attr_prefix='',cdata_key='text')
        survey = json.loads(json.dumps(survey).replace('"true"','true').replace('"false"','false'))
        response = survey['survey']
    return response

@app.route('/')
def index():
    instances = pd.read_csv(instance_list)
    instances = instances.to_dict("records")
    return render_template('index.html', instances=instances)

@app.route('/<instance>/<surveyId>/<lang>')
def survey(instance,surveyId,lang):
    ziploc = './static/xml/'+ instance
    if not os.path.exists(ziploc):
        os.mkdir(ziploc)
    xmlpath = ziploc + '/' + surveyId + '.xml'
    instances = pd.read_csv(instance_list)
    endpoint = list(instances[instances['instances'] == instance]['names'])[0]
    download = False
    if lang == 'update':
        download = True
    if not os.path.exists(xmlpath):
        download = True
    if download:
        print(endpoint+surveyId+'.zip')
        zipurl = r.get(endpoint+surveyId+'.zip', allow_redirects=True)
        z = ZipFile(BytesIO(zipurl.content))
        z.extractall(ziploc)
        zipurl = r.get(endpoint+surveyId+'.zip', allow_redirects=True)
        z = ZipFile(BytesIO(zipurl.content))
        z.extractall(ziploc)
    response = readxml(ziploc + '/' +surveyId + '.xml')
    cascadeList = []
    for groups in response["questionGroup"]:
        try:
            for q in groups["question"]:
                if q["type"] == "cascade":
                    cascadeList.append(endpoint + q["cascadeResource"] + ".zip")
        except:
            pass
    if len(cascadeList) > 0:
        for cascade in cascadeList:
            cascadefile = ziploc + '/' + cascade.split('/surveys/')[1].replace('.zip','')
            download = False
            if lang == 'update':
                download = True
            if not os.path.exists(cascadefile):
                download = True
            if download:
                print("downloading... " + cascade)
                zipurl = r.get(cascade, allow_redirects=True)
                z = ZipFile(BytesIO(zipurl.content))
                z.extractall(ziploc)
    return jsonify(response)

@app.route('/cascade/<instance>/<sqlite>/<lv>')
def cascade(instance,sqlite,lv):
    casloc = './static/xml/'+ instance +'/'+ sqlite
    conn = sqlite3.connect(casloc)
    table = pd.read_sql_query("SELECT * FROM nodes;", conn)
    result = table[table['parent'] == int(lv)].sort_values(by="name").to_dict('records')
    return jsonify(result)

@app.route('/submit-form', methods=['POST'])
def submit():
    rec = request.get_json()
    questionId = rec['questionId'].split(',')
    answerType = rec['answerType'].split(',')
    data = []
    meta_name = {
        "answerType": "META_NAME",
        "iteration": 0,
        "questionId": "-1",
        "value": rec['_dataPointName']
    }
    meta_geo = {
        "answerType": "META_GEO",
        "iteration": 0,
        "questionId": "-2",
        "value": "-8.6764779|115.236364|0"
    }
    data.append(meta_name)
    data.append(meta_geo)
    for i, ids in enumerate(questionId):
        try:
            if answerType[i] == "OPTION":
                try:
                    vals = []
                    for rc in list(ast.literal_eval(rec[ids])):
                        vals.append({"text":rc})
                    val = json.dumps(vals)
                except:
                    val = json.dumps([{"text":rec[ids]}])
                print(val)
            elif answerType[i] == "CASCADE":
                vals = []
                for rc in list(ast.literal_eval(rec[ids])):
                    vals.append({"name":rc, "code":rc})
                val = json.dumps(vals)
            else:
                val = rec[ids]
            aType = answerType[i]
            if answerType[i] in ["FREE"]:
                aType = "VALUE"
            form = {
                "answerType": aType,
                "iteration": 0,
                "questionId": ids,
                "value": val
            }
            data.append(form)
        except:
            pass
    startdate = datetime.fromtimestamp(int(rec["_submissionStart"])/1000)
    enddate = datetime.fromtimestamp(int(rec["_submissionStop"])/1000)
    duration = enddate - startdate
    duration = round(duration.total_seconds())
    version = float(rec['_version'])
    payload = {
        "dataPointId": rec['_dataPointId'],
        "deviceId": rec['_deviceId'],
        "duration": duration,
        "formId": rec['_formId'],
        "formVersion": version,
        "responses": data,
        "submissionDate": int(rec['_submissionStop']),
        "username": "Deden Akvo",
        "uuid": rec['_uuid']
    }
    response = r.post(posturl, headers=header, data=json.dumps(payload))
    #sendZip(results, rec['_uuid'])
    return jsonify(response.json())

def sendZip(results, uuid):
    with open('data.json','w') as f:
        json.dump(results, f)
    zip_name = uuid  + '.zip'
    zip_file = ZipFile(zip_name, 'w')
    zip_file.write('data.json', compress_type=ZIP_DEFLATED)
    zip_file.close()
    if os.path.isfile('data.json'):
        os.remove('data.json')
    if not os.path.exists('./tmp'):
        os.mkdir('./tmp')
    os.rename(zip_name, './tmp/' + zip_name)


if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True, port=5000)
