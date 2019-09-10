## Init Dependencies

import os
from util.util import Printer
from util.rsr import Rsr
from util.api import Api
from flask import Flask, jsonify, Response, render_template
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

### Workspace Setup

printer = Printer()
rsr = Rsr()
get_data = Api()

## Helper Functions

## API I: Result Framework

@app.route('/api/<env>/<trigger>/<endpoint>', methods=['GET'])
def api(env,trigger, endpoint):
    print(printer.get_time() + ' :: ACCESS - ' + endpoint)
    if not endpoint in rsr.result_framework:
        return Response("{'message':'enpoint has no contents'}",
                status=204,
                mimetype='application/json')
    update = False
    if trigger == 'update':
        update = True
    if not os.path.exists('./cache/' + endpoint + '.json'):
        update = True
    if update:
        get_data.api_results_framwork(env, rsr.project_id)
    response = rsr.readcache(endpoint)
    return jsonify(response)

@app.route('/render/<project_type>/<project>/')
def get_template(project_type, project):
    html_template = project_type + "_" + project + ".html"
    return render_template(html_template)

@app.route('/')
def index():
    project_parent = rsr.api('prod', 'project', 'id', 7283)['results'][0]
    projects = []
    countries = ['Zambia','Malawi','Mozambique']
    for p in [7950,7282]:
        project = rsr.api('prod', 'project', 'id', p)['results'][0]
        projects.append(project)
    return render_template('index.html',
            environment = '/appsa-api',
            project_parent = project_parent,
            projects = projects,
            countries = countries)

if __name__ == '__main__':
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host= '0.0.0.0',debug=True, port=5000)
