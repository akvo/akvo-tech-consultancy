from flask import Flask, request, jsonify
import requests as r
import json
import logging
import base64

instance_base = 'https://api-auth0.akvo.org/flow/orgs/'

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)

def get_headers(token):
    login = {'client_id': 'S6Pm0WF4LHONRPRKjepPXZoX1muXm1JS',
             'grant_type': 'refresh_token',
             'refresh_token': token,
             'scope': 'openid email'}
    data = r.post("https://akvofoundation.eu.auth0.com/oauth/token", data=login)
    if data.status_code == 200:
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.akvo.flow.v2+json',
            'Authorization': 'Bearer {}'.format(data.json().get('id_token'))
        }
    return False

def get_data(uri, auth):
    return r.get(uri, headers=auth).json()

def fetch_all(url, headers, formInstances=[]):
    data = get_data(url, headers)
    next_url = data.get('nextPageUrl')
    data = data.get('formInstances')
    for d in data:
        formInstances.append(d)
    if next_url:
        fetch_all(next_url, headers, formInstances)
    return formInstances

def data_handler(data, qType):
    if data:
        if qType in ['FREE_TEXT', 'NUMBER','BARCODE', 'DATE', 'GEOSHAPE', 'SCAN', 'CADDISFLY']:
            return data
        if qType == 'OPTION':
            return handle_list(data, "text")
        if qType == ['CASCADE']:
            return handle_list(data, "name")
        if qType == ['PHOTO', 'VIDEO']:
            return data.get('filename')
        if qType == 'VIDEO':
            return data.get('filename')
        if qType == 'GEO':
            return {'lat': data.get('lat'), 'long': data.get('long')}
        if qType == 'SIGNATURE':
            return data.get("name")
    return None

def handle_list(data, target):
    response = []
    for value in data:
        if value.get("code"):
            response.append("{}:{}".format(value.get("code"), value.get(target)))
        else:
            response.append(value.get(target))
    return "|".join(response)

@app.route('/')
def health_check():
    return "OK"

@app.route('/generate/<instance>/<survey_id>/<form_id>')
def generate_url(instance, survey_id, form_id):
    uri = '{}/{}/{}'.format(instance, survey_id, form_id).encode('ascii')
    uri = base64.b64encode(uri).decode("utf8")
    uri = '{}{}'.format(request.host_url, uri)
    return jsonify({'data-url':uri})

@app.route('/<instance>/<survey_id>/<form_id>')
def get_page(instance, survey_id, form_id):
    token = request.headers.get('token')
    if not token:
        return jsonify({"message": "ERROR: Unauthorized"}), 401
    headers = get_headers(token)
    if not headers:
        return jsonify({"message": "ERROR: Unauthorized"}), 401
    instance_uri = '{}{}'.format(instance_base, instance)
    form_instance_url = '{}/form_instances?survey_id={}&form_id={}'.format(instance_uri, survey_id,form_id)
    collections = fetch_all(form_instance_url, headers)
    form_definition = get_data('{}/surveys/{}'.format(instance_uri,survey_id), headers)
    form_definition = form_definition.get('forms')
    form_definition = list(filter(lambda x: x['id'] == form_id, form_definition))[0].get('questionGroups')
    results = []
    for col in collections:
        dt = {}
        info = {}
        for c in col:
            if c != 'responses':
                info.update({c: col[c]})
            else:
                groups = {}
                for g in form_definition:
                    group = {}
                    try:
                        answers = col[c][g['id']]
                        for q in g['questions']:
                                d = data_handler(answers[0][q['id']], q['type'])
                                n = "{}|{}".format(q['id'], q['name'])
                                group.update({n:d})
                    except:
                        pass
                    groups.update({g['name']: group})
                dt.update(groups)
            dt.update({'Info':info})
        results.append(dt)
    return jsonify(results)

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    from waitress import serve
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    serve(app, host="0.0.0.0", port=5000)
