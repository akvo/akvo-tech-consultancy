## Init Dependencies

import os
from util.util import Printer
from util.rsr import Rsr
from util.api import Api
from flask import Flask, jsonify, Response, render_template, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

### Workspace Setup

printer = Printer()
rsr = Rsr()
get_data = Api()

@app.route('/api/<trigger>/<endpoint>/<rsr_id>', methods=['GET'])
def api(trigger, endpoint, rsr_id):
    print(printer.get_time() + ' :: ACCESS - ' + endpoint)
    if not endpoint in rsr.result_framework:
        return Response("{'message':'enpoint has no contents'}",
                status=204,
                mimetype='application/json')
    update = False
    directory = './cache/' + endpoint + '/'
    if trigger == 'update':
        update = True
    if not os.path.exists(directory):
        os.makedirs(directory)
    cache = directory + rsr_id + '.json'
    if not os.path.exists(cache):
        update = True
    if update:
        if endpoint == 'rf':
            get_data.api_results_framwork(rsr_id)
        else:
            rsr.api(endpoint,'project',rsr_id)
    response = rsr.readcache(cache)
    return jsonify(response)

@app.route('/api/datatables/<rsr_id>', methods=['GET','POST'])
def get_datatable(rsr_id):
    content = request.json
    filter_date = content['filter_date']
    filter_country = content['project_option']
    data = get_data.datatable(rsr_id, 'parent', filter_date, filter_country)
    return jsonify(data)

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
