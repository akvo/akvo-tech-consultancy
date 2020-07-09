import requests as r
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['POST'])
def login():
    params = request.get_json()
    data = r.post('https://api-auth0.akvo.org/flow/orgs/2scale/folders?parentId=0', headers=params)
    return jsonify(data)

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True, port=5000)
