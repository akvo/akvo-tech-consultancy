import requests as r
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/login', methods=['GET','POST'])
def login():
    params = request.headers.get('Authorization')
    print(params)
    data = r.get('https://api-auth0.akvo.org/flow/orgs/2scale/folders?parentId=0', headers={
        "Authorization": params,
        "Accept":"application/vnd.akvo.flow.v2+json",
        "Content-Type":"application/json",
        })
    return jsonify(data.json())

if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(host='0.0.0.0', debug=True, port=5000)
