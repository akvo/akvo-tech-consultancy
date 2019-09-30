## Init Dependencies

import os
from util.util import Printer
from util.rsr import Rsr
from util.api import Api
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

### Workspace Setup

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
    content = request.json
    filter_date = content['filter_date']
    report_type = content['report_type']
    filter_country = content['project_option']
    data = get_data.datatable(rsr_id, 'parent', report_type, filter_date, filter_country)
    return jsonify(data)

@app.route('/api/postcomment', methods=['POST'])
def generate_validator():
    content = request.json
    notes = printer.get_uuid(content["validator"])
    notes = '#'.join(notes)
    data = {
            "locations": [],
            "editable": True,
            "deletable": True,
            "edited": True,
            "title": content["title"],
            "text": content["message"],
            "language": "en",
            "update_method": "W",
            "user_agent": "Akvo Report Generator",
            "uuid": "",
            "notes": notes,
            "project": 7282,
            "user":43779
    }
    resp = rsr.send_comment(data)
    return jsonify(resp)

@app.route('/api/getcomments', methods=['POST'])
def get_comments():
    validator = printer.get_uuid(request.json)
    validator = '#'.join(validator)
    response = rsr.live('project_update', 'project', 7282)['results']
    response = rsr.get_comment(response, validator)
    return jsonify(response)

@app.route('/')
def index():
    appsa = '7950'
    base_url = printer.get_path(request.headers['Host'])
    project_parent = rsr.api('project', 'id', 7283)['results'][0]
    projects = []
    countries = ['Zambia','Malawi','Mozambique']
    directory = './cache/rf/'
    if not os.path.exists(directory):
        os.makedirs(directory)
    cache = './cache/rf/' + appsa + '.json'
    if not os.path.exists(cache):
        get_data.api_results_framwork(appsa)
    period_list = rsr.readcache(cache).get('period_list')
    for p in [7283,7950]:
        project = rsr.api('project', 'id', p)['results'][0]
        projects.append(project)
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
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host= '0.0.0.0',debug=True, port=5000)
