import os
from util.util import Printer
from util.rsr import Rsr
from util.api import Api
import pandas as pd
import json
import logging
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

app = Flask(__name__)
logging.basicConfig(level=logging.DEBUG)
CORS(app)

printer = Printer()
rsr = Rsr()
get_data = Api()

@app.route('/api/<endpoint>/<param>/<val>', methods=['GET'])
def api(endpoint, param, val):
    response = rsr.api(endpoint, param, val)['results']
    return jsonify(response)

@app.route('/api/live/<endpoint>/<param>/<val>', methods=['GET'])
def live(endpoint, param, val):
    response = rsr.live(endpoint, param, val)['results']
    return jsonify(response)

@app.route('/api/datatables/<rsr_id>', methods=['GET','POST'])
def get_datatable(rsr_id):
    directory = './cache/datatables'
    if not os.path.exists(directory):
        os.makedirs(directory)
    content = request.json
    filter_date = content['filter_date']
    report_type = content['report_type']
    filter_country = content['project_option']
    directory = f"{directory}/{report_type}"
    if not os.path.exists(directory):
        os.makedirs(directory)
    rsr_pos = 'parent'
    if rsr_id == '7283':
       rsr_id = '7282'
       rsr_pos = 'grand_parent'
    filename = rsr_id + "_" + filter_date.replace(" ", "_")
    filename = f"{directory}/{filename}.json"
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    try:
        data = get_data.datatable(rsr_id, rsr_pos, report_type, filter_date)
        with open(filename, 'w') as outfile:
            json.dump(data, outfile)
        return jsonify(data)
    except:
        return "Not Found", 404

@app.route('/api/postcomment', methods=['POST'])
def generate_validator():
    content = request.json
    data = {
            "editable": True,
            "deletable": True,
            "title": content["title"],
            "text": content["message"],
            "language": "en",
            "update_method": "W",
            "user_agent": "Akvo Report Generator",
            "notes": content["validator"],
            "project": 7282,
            "user":43779
    }
    if content["id"]:
        methods = "patch"
        data.update({"id":int(content["id"])})
        resp = rsr.send_comment(data, methods)
    else:
        methods = "post"
        resp = rsr.send_comment(data, methods)
    return jsonify(resp)

@app.route('/api/getcomments', methods=['POST'])
def get_comments():
    validator = request.json
    response = rsr.live('project_update', 'project', 7282)['results']
    response = rsr.get_comment(response, validator['uuid'])
    return jsonify(response)

@app.route('/api/comment-validator', methods=['POST'])
def get_comment_validator():
    validator = printer.get_uuid(request.json)
    validator = '#'.join(validator)
    return validator

@app.route('/')
def index():
    appsa = '7950'
    base_url = printer.get_path(request.headers['Host'])
    project_parent = rsr.api('project', 'id', 7283)['results'][0]
    projects = []
    countries = ['Zambia','Malawi','Mozambique']
    directory = './cache/rf'
    if not os.path.exists(directory):
        os.makedirs(directory)
    cache = './cache/rf/' + appsa + '.json'
    if not os.path.exists(cache):
        get_data.api_results_framwork(appsa)
    period_list = rsr.readcache(cache).get('period_list')
    for p in [7283,7950]:
        project = rsr.api('project', 'id', p)['results'][0]
        projects.append(project)
    period_year = pd.DataFrame(period_list['Yearly'])
    period_year = period_year.drop_duplicates(['year'])
    period_list['Yearly'] = period_year.to_dict('records')
    return render_template('index.html',
            base_url = base_url,
            period_list = period_list,
            project_parent = project_parent,
            projects = projects,
            countries = countries)

@app.route('/api/destroy_cache', methods=['GET'])
def destroy_cache():
    cache_dir = "./cache"
    dirs = os.listdir(cache_dir)
    return jsonify(dirs)

@app.route('/render/<project_type>/<project>/')
def get_template(project_type, project):
    html_template = project_type + "_" + project + ".html"
    return render_template(html_template)

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    from waitress import serve
    serve(app, host="0.0.0.0", port=5000)
