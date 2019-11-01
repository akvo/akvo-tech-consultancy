from flask import Flask, jsonify, render_template, request, make_response
from flask_cors import CORS
from lxml import etree
from io import BytesIO
from zipfile import ZipFile, ZIP_DEFLATED
from datetime import datetime
import uuid
import pandas as pd
import requests as r
import sqlite3
import xmltodict
import json
import os
import ast
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
CORS(app)
instance_list = './data/flow-survey-amazon-aws.csv'
BASE_URL="https://flow-services.akvotest.org/upload"
PASSWORD="2SCALE"

UPLOAD_FOLDER='./tmp/images'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

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

def submitprocess(rec, _uuid):
    rec = request.get_json()
    _uuid = str(uuid.uuid4())
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
    imagelist = []
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
            elif answerType[i] == "PHOTO":
                val = json.dumps({"filename":rec[ids]})
                imagelist.append(rec[ids])
            elif answerType[i] == "CASCADE":
                vals = []
                for rc in list(ast.literal_eval(rec[ids])):
                    vals.append({"code":rc["text"], "name":rc["text"]})
                val = json.dumps(vals)
            else:
                val = rec[ids]
            aType = answerType[i]
            if answerType[i] in ["FREE"]:
                aType = "VALUE"
            if answerType[i] in ["PHOTO"]:
                aType = "IMAGE"
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
        "uuid": _uuid
    }
    sendZip(payload, _uuid, rec['_instanceId'], imagelist)
    return jsonify(payload)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def sendZip(payload, _uuid, instance_id, imagelist):
    with open('data.json','w') as f:
        json.dump(payload, f)
    zip_name = _uuid + '.zip'
    zip_file = ZipFile(zip_name, 'w')
    zip_file.write('data.json', compress_type=ZIP_DEFLATED)
    zip_file.close()
    os.rename(zip_name, zip_name)
    combined="all-{}.zip".format(round(datetime.today().timestamp()))
    with ZipFile(combined, 'w') as all_zip:
        all_zip.write(zip_name)
        for image in imagelist:
            if os.path.isfile('./tmp/images/' + image ):
                os.rename('./tmp/images/' + image, image)
                all_zip.write(image)
                os.remove(image)

    fsize = os.path.getsize(combined)
    uid = str(uuid.uuid4())
    params = {
        'resumableChunkNumber': 1,
        'resumableChunkSize': 524288,
        'resumableCurrentChunkSize': fsize,
        'resumableTotalSize': fsize,
        'resumableType': 'application/zip',
        'resumableIdentifier': uid,
        'resumableFilename': combined,
        'resumableRelativePath': combined,
        'resumableTotalChunks': 1
    }

    files = {
        'file': (combined, open(combined, 'rb'), 'application/zip')
    }
    result = r.post(BASE_URL, files= files, data=params)
    bucket = instance_id + '.s3.amazonaws.com'
    instances = pd.read_csv(instance_list)
    bucket_url = 'https://' + bucket + '/surveys/'
    dashboard = list(instances[instances['names'] == bucket_url]['instances'])[0]
    params = {
        'uniqueIdentifier': uid,
        'filename': combined,
        'baseURL': dashboard,
        'appId': instance_id,
        'uploadDomain': bucket,
        'complete': 'true'
    }
    result = r.post(BASE_URL, data=params)
    if not os.path.exists('./tmp'):
        os.mkdir('./tmp')
    if os.path.isfile('data.json'):
        os.remove('data.json')
    if os.path.isfile(combined):
        os.rename(combined, './tmp/ ' + combined)
    return result

@app.route('/submit-form', methods=['POST', 'OPTIONS'])
def submit():
    rec = request.get_json()
    _uuid = str(uuid.uuid4())
    submit = False
    if request.method == 'POST':
        if rec['_password'] == PASSWORD:
            submit = True
        if submit:
            response = submitprocess(rec, _uuid)
            return response
    if request.method == 'OPTIONS':
            return make_response("Verified", 200)
    resp = make_response("Integrity Error", 400)
    return resp

@app.route('/fetch-image', methods=['GET'])
def fetch_file():
    return jsonify(request.headers)

@app.route('/delete-image/<image_file>')
def delete_file(image_file):
    image_path = './tmp/images/' + image_file
    if os.path.exists(image_path):
        os.remove(image_path)
        return jsonify({'file': image_file, 'status': 'removed'})
    else:
        return make_response("Image is Expired", 204)


@app.route('/upload-image', methods=['GET', 'POST', 'DELETE', 'OPTIONS'])
def upload_file():
    files = dict(request.files)
    if not os.path.exists('./tmp'):
        os.mkdir('./tmp')
    if not os.path.exists('./tmp/images'):
        os.mkdir('./tmp/images')
    if request.method == "POST":
        _uuid = str(uuid.uuid4())
        for f in list(files):
            image = files[f]
            fn = image.filename
            fn = fn.split('.')[-1]
            _uuid += '.' + fn
            image.save(os.path.join(app.config['UPLOAD_FOLDER'], _uuid))
        resp = make_response(_uuid, 200)
        resp.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
        resp.headers['Content-Type'] = request.headers['Content-Type']
        resp.headers['Accept'] = request.headers['Accept']
        resp.headers['Accept-Encoding'] = request.headers['Accept-Encoding']
        return resp
    elif request.method == "OPTIONS":
        method = request.headers['Access-Control-Request-Method']
        if method == "DELETE":
            resp = delete_file(request.text)
        if method == "POST":
            resp = make_response("Success", 200)
            resp.headers['Access-Control-Allow-Origin'] = request.headers['Origin']
            resp.headers['Accept'] = request.headers['Accept']
            resp.headers['Accept-Encoding'] = request.headers['Accept-Encoding']
        return resp
    elif request.method == "DELETE":
        response = delete_file(request.text)
        return response
    else:
        return make_response("Failed", 400)

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True, port=5000)
