from dataclasses import dataclass
from flask import Flask, jsonify, render_template, request, make_response, send_file
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
from flask_httpauth import HTTPBasicAuth
from sqlalchemy import text
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
CORS(app)

auth = HTTPBasicAuth()
DEFAULT_PASSWORD = os.environ["BASIC_PWD"]
users = {
    os.environ["BASIC_ADMIN"]: generate_password_hash(DEFAULT_PASSWORD),
}

instance_list = './data/flow-survey-amazon-aws.csv'
FLOW_SERVICE_URL = os.environ['FLOW_SERVICE_URL']
AUTH0_URL = "{}/token".format(os.environ['AUTH0_URL'])
BASE_URL = "{}/upload".format(FLOW_SERVICE_URL)
PASSWORD = "2SCALE"
DEVEL = False

UPLOAD_FOLDER = './tmp/images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)
db.init_app(app)
migrate.init_app(app, db)


@dataclass
class FormInstance(db.Model):
    id: str
    state: str

    id = db.Column(db.String, primary_key=True, server_default=text('gen_random_uuid()::varchar'))
    state = db.Column(db.String, nullable=False)
    created = db.Column(db.DateTime, nullable=False, server_default=text('now()'))
    updated = db.Column(db.DateTime, nullable=False, server_default=text('now()'))

@auth.verify_password
def verify_password(username, password):
    if username in users and \
            check_password_hash(users.get(username), password):
        return username


def readxml(xmlpath):
    with open(xmlpath) as survey:
        encoding = etree.parse(survey)
        encoding = encoding.docinfo.encoding
    with open(xmlpath) as survey:
        survey = xmltodict.parse(survey.read(), encoding=encoding, attr_prefix='', cdata_key='text')
        survey = json.loads(json.dumps(survey).replace('"true"', 'true').replace('"false"', 'false'))
        response = survey['survey']
    return response


def make_tree(path):
    tree = dict(name=os.path.basename(path), children=[])
    try:
        lst = os.listdir(path)
    except OSError:
        pass  # ignore errors
    else:
        for name in lst:
            fn = os.path.join(path, name)
            if os.path.isdir(fn):
                tree['children'].append(make_tree(fn))
            else:
                tree['children'].append(dict(name=name, parent=tree))
    return tree


@app.route('/')
@auth.login_required
def index():
    path = os.path.expanduser('./static/xml')
    return render_template('index.html', tree=make_tree(path))


@app.route('/<folder>/<file>')
def openxml(folder, file):
    path = './static/xml/' + folder + '/' + file
    if ".sqlite" in file:
        conn = sqlite3.connect(path)
        table = pd.read_sql_query("SELECT * FROM nodes;", conn)
        data = table.to_dict('records')
        return jsonify(data)
    data = readxml(path)
    return data


@app.route('/<instance>/<survey_id>/<check>')
def survey(instance, survey_id, check):
    ziploc = './static/xml/' + instance
    if not os.path.exists(ziploc):
        os.mkdir(ziploc)
    xml_path = ziploc + '/' + survey_id + '.xml'
    instances = pd.read_csv(instance_list)
    endpoint = list(instances[instances['instances'] == instance]['names'])[0]
    download = False
    if check == 'update':
        download = True
    if not os.path.exists(xml_path):
        download = True
    if download:
        zip_url = r.get(endpoint + survey_id + '.zip', allow_redirects=True)
        if zip_url.status_code == 403:
            return jsonify({"message": "Form is not available"}), 403
        z = ZipFile(BytesIO(zip_url.content))
        z.extractall(ziploc)
        zip_url = r.get(endpoint + survey_id + '.zip', allow_redirects=True)
        z = ZipFile(BytesIO(zip_url.content))
        z.extractall(ziploc)
    response = readxml(ziploc + '/' + survey_id + '.xml')
    cascade_list = []
    question_group_type = type(response["questionGroup"])
    if question_group_type is list:
        for groups in response["questionGroup"]:
            try:
                for q in groups["question"]:
                    if q["type"] == "cascade":
                        cascade_list.append(endpoint + q["cascadeResource"] + ".zip")
            except:
                pass
    if question_group_type is dict:
        try:
            for q in response["questionGroup"]["question"]:
                if q["type"] == "cascade":
                    cascade_list.append(endpoint + q["cascadeResource"] + ".zip")
        except:
            pass
    if len(cascade_list) > 0:
        for cascade in cascade_list:
            cascade_file = ziploc + '/' + cascade.split('/surveys/')[1].replace('.zip', '')
            download = False
            if check == 'update':
                download = True
            if not os.path.exists(cascade_file):
                download = True
            if download:
                zip_url = r.get(cascade, allow_redirects=True)
                z = ZipFile(BytesIO(zip_url.content))
                z.extractall(ziploc)
    return jsonify(response)


@app.route('/cascade/<instance>/<sqlite>/<lv>')
def cascade(instance, sqlite, lv):
    location = './static/xml/' + instance + '/' + sqlite
    conn = sqlite3.connect(location)
    table = pd.read_sql_query("SELECT * FROM nodes;", conn)
    result = table[table['parent'] == int(lv)].sort_values(by="name").to_dict('records')
    return jsonify(result)


def get_payload(rec, _uuid, webform=False):
    question_id = rec['questionId'].split(',')
    answer_type = rec['answerType'].split(',')
    data = []
    meta_name = {
        "answerType": "META_NAME",
        "iteration": 0,
        "questionId": "-1",
        "value": rec['_dataPointName']
    }
    data_point_location = "-8.6764779|115.236364|0"
    try:
        data_point_location = rec['_dataPointLocation']
    except:
        pass
    meta_geo = {
        "answerType": "META_GEO",
        "iteration": 0,
        "questionId": "-2",
        "value": data_point_location
    }
    data.append(meta_name)
    data.append(meta_geo)
    images = []
    for i, ids in enumerate(question_id):
        iteration = 0
        if (webform):
            iteration = ids.split('-')[1]
        try:
            if answer_type[i] == "OPTION":
                try:
                    values = []
                    answers = list(ast.literal_eval(rec[ids]))
                    for rc in answers:
                        if rc["text"] == "Other Option":
                            if rec["other_" + ids]:
                                values.append({"text": rec["other_" + ids], "isOther": True})
                            else:
                                values.append({"text": "No Answer", "isOther": True})
                        else:
                            try:
                                values.append({"text": rc["text"], "code": rc["code"]})
                            except:
                                values.append({"text": rc["text"]})
                    val = json.dumps(values)
                except:
                    val = json.dumps([{"text": rec[ids]}])
            elif answer_type[i] == "PHOTO":
                val = json.dumps({"filename": rec[ids]})
                images.append(rec[ids])
            elif answer_type[i] == "CASCADE":
                values = []
                for rc in list(ast.literal_eval(rec[ids])):
                    values.append({"code": rc["text"], "name": rc["text"]})
                val = json.dumps(values)
            elif answer_type[i] == "DATE":
                obj_date = datetime.strptime(rec[ids], "%Y-%m-%d")
                val = int(datetime.timestamp(obj_date) * 1000)
            else:
                val = rec[ids]
            a_type = answer_type[i]
            if answer_type[i] in ["FREE"]:
                a_type = "VALUE"
            if answer_type[i] in ["PHOTO"]:
                a_type = "IMAGE"
            question_id = ids.split('-')[0]
            form = {
                "answerType": a_type,
                "iteration": iteration,
                "questionId": question_id,
                "value": val
            }
            data.append(form)
        except:
            pass
    start_date = datetime.fromtimestamp(int(rec["_submissionStart"]) / 1000)
    end_date = datetime.fromtimestamp(int(rec["_submissionStop"]) / 1000)
    duration = end_date - start_date
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
        "username": rec['_username'],
        "uuid": _uuid
    }
    return {"payload": payload,
            "images": images}


def submit_process(rec, _uuid):
    rec = request.get_json()
    _uuid = str(uuid.uuid4())
    data = get_payload(rec, _uuid)
    send_zip(data['payload'], _uuid, rec['_instanceId'], data['images'])
    return jsonify(data['payload'])


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def send_zip(payload, _uuid, instance_id, imagelist):
    with open('data.json', 'w') as f:
        json.dump(payload, f)
    zip_name = _uuid + '.zip'
    zip_file = ZipFile(zip_name, 'w')
    zip_file.write('data.json', compress_type=ZIP_DEFLATED)
    zip_file.close()
    os.rename(zip_name, zip_name)
    combined = "all-{}.zip".format(round(datetime.today().timestamp()))
    with ZipFile(combined, 'w') as all_zip:
        all_zip.write(zip_name)
        for image in imagelist:
            if os.path.isfile('./tmp/images/' + image):
                os.rename('./tmp/images/' + image, image)
                all_zip.write(image)
                os.remove(image)

    file_size = os.path.getsize(combined)
    uid = str(uuid.uuid4())
    params = {
        'resumableChunkNumber': 1,
        'resumableChunkSize': file_size,
        'resumableCurrentChunkSize': file_size,
        'resumableTotalSize': file_size,
        'resumableType': 'application/zip',
        'resumableIdentifier': uid,
        'resumableFilename': combined,
        'resumableRelativePath': combined,
        'resumableTotalChunks': 1
    }

    files = {
        'file': (combined, open(combined, 'rb'), 'application/zip')
    }
    result = r.post(BASE_URL, files=files, data=params)
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
    if os.path.isfile(zip_name):
        os.remove(zip_name)
    if os.path.isfile(combined):
        os.rename(combined, './tmp/ ' + combined)
    return result


def check_password(rec):
    default_pass = rec['_default_password'] if '_default_password' in rec else False
    password = rec['_password'] if '_password' in rec else False
    if default_pass == DEFAULT_PASSWORD:
        return True
    if password == PASSWORD:
        return True
    return False


def get_token():
    data = {
        'client_id': os.environ['AUTH0_CLIENT_FLOW'],
        'username': os.environ['AUTH0_USER'],
        'password': os.environ['AUTH0_PWD'],
        'grant_type': 'password',
        'scope': 'openid email'
    }
    account = r.post(AUTH0_URL, data)
    try:
        account = account.json()
    except:
        print('FAILED: TOKEN ACCESS UNKNOWN')
        return False
    return account['id_token']


def aws_s3_parameters(instance):
    url = "{}/sign".format(FLOW_SERVICE_URL)
    token = get_token()
    return r.get(url, params={"instance": instance}, headers={'Authorization': 'Bearer {}'.format(token)}).json()


def upload_parameters(rec, _uuid):
    data = get_payload(rec, _uuid, True)
    s3 = aws_s3_parameters(rec["_instanceId"])
    return {"data": data["payload"],
            "policy": s3}


@app.route('/submit-form', methods=['POST'])
def submit():
    rec = request.get_json()
    _uuid = str(uuid.uuid4())
    valid = check_password(rec)
    if valid:
        return submit_process(rec, _uuid)
    return jsonify({"message": "Password is wrong"}), 400


@app.route('/upload-data', methods=['POST'])
def upload_data():
    rec = request.get_json()
    _uuid = str(uuid.uuid4())
    valid = check_password(rec)
    if valid:
        return upload_parameters(rec, _uuid)
    return jsonify({"message": "Password is wrong"}), 400


@app.route('/fetch-image/<image_file>', methods=['GET'])
def fetch_file(image_file):
    image_path = './tmp/images/' + image_file
    file_type = image_file.rsplit('.', 1)[1].lower()
    if os.path.exists(image_path):
        return send_file(image_path, mimetype="image/" + file_type)
    return jsonify({"message": "Asset is deleted"}), 400


@app.route('/delete-image/<image_file>')
def delete_file(image_file):
    image_path = './tmp/images/' + image_file
    if os.path.exists(image_path):
        os.remove(image_path)
        return jsonify({'file': image_file, 'status': 'removed'})
    else:
        return jsonify({"message": "File has been removed"}), 204


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
            if DEVEL:
                image = image[0]
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
        return jsonify({"message": "Failed to send"}), 400


@app.route('/form-instance', defaults={'form_instance_id': None}, methods=['POST'])
@app.route('/form-instance/<form_instance_id>', methods=['GET', 'PUT'])
def form_instance(form_instance_id):
    if request.method == 'GET':
        instance = FormInstance.query.get(form_instance_id)
        if instance is None:
            return jsonify({"message": "Not found"}), 404
        return jsonify(instance)
    if request.method == 'POST':
        params = request.get_json()
        if params.get('_formId') is None or params.get('_dataPointId') is None:
            return jsonify({"message": "Bad request, _formId and _dataPointId parameters are required"}), 400
        instance = FormInstance(state=request.get_data(as_text=True));
        db.session.add(instance)
        db.session.commit()
        return jsonify(instance)
    if request.method == 'PUT':
        instance = FormInstance.query.get(form_instance_id)
        if instance is None:
            return jsonify({"message": "Instance {} not found".format(form_instance_id)}), 400
        instance.updated = datetime.now()
        instance.state = request.get_data(as_text=True);
        db.session.add(instance)
        db.session.commit()
        return jsonify(instance)
    return jsonify({"message": "Bad request"}), 400


if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True, port=5000)
