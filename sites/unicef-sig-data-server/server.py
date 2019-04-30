import pandas as pd
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/api', methods=['GET', 'POST'])
def api():
    df = pd.read_csv('./data/data-cleaning-template.csv')
    df = df.to_dict('records')
    return jsonify(df)

if __name__ == '__main__':
    app.run(host= '0.0.0.0',debug=True, port=3000)

