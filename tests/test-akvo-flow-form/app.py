from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit
from subprocess import Popen, PIPE

import logging
import threading
import os

app = Flask(__name__)
socketio = SocketIO(app, async_mode="threading")
logging.basicConfig(level=logging.WARN)

global test_is_running
test_is_running = False

def bthread(data, tp):
    emit("response", {"data": data, "type": tp, "running": test_is_running}, namespace="/status", broadcast=True)
    socketio.sleep(0)

@socketio.on("connect", namespace="/status")
def connect():
    emit("response", {"data": False, "type": "exit", "running" : test_is_running}, namespace="/status", broadcast=True)
    socketio.sleep(0)

def processing(command):
    cmd = Popen(command, shell=True, stderr=PIPE, stdout=PIPE, cwd='./')
    for line in iter(cmd.stdout.readline, b''):
        line = line.decode('utf-8').rstrip()
        bthread(line, 'output')
    for line in iter(cmd.stderr.readline, b''):
        line = line.decode('utf-8').rstrip()
        bthread(line, 'error')
    return True

def startUpdate():
    global test_is_running
    try:
        try:
            bthread("\n--- TEST IS RUNNING ---\n", 'output')
            test_is_running = True
            processing("./test.sh")
        except:
            bthread("\n--- INTERNAL SERVER ERROR ---\n", 'error')
    finally:
        bthread("", 'output')
        bthread("\n--- TEST COMPLETED ---\n", 'output')
        test_is_running = False
        bthread("\n--- EXIT ---\n", 'output')
    return True

def recursive_glob(suffix='', rootdir='.'):
    return [os.path.join(looproot, filename)
            for looproot, _, filenames in os.walk(rootdir)
            for filename in filenames if filename.endswith(suffix)]

@app.route("/")
def main():
    return render_template("app.html", data={"job": False}, sync_mode=socketio.async_mode)

@app.route("/code", methods=['POST'])
def code():
    if request.method == 'POST':
        req = request.form['data'];
        cfiles = recursive_glob(req)[0]
        thecode = Popen('cat ' + cfiles, shell=True, stderr=PIPE, stdout=PIPE, cwd='./')
        thelines = [];
        for line in iter(thecode.stdout.readline, b''):
            thelines.append(line.decode('utf-8').rstrip())
        return jsonify({"response": True, "data": thelines})
    return jsonify({"response": False, "data": None})

@app.route("/update")
def update():
    if test_is_running is False:
        update_thread = threading.Thread(target=startUpdate)
        update_thread.run()
        return jsonify({"response": True})
    return jsonify({"response": True})


if __name__ == "__main__":
    app.config.update(DEBUG=True, sync_mode=socketio.async_mode)
    socketio.run(app, host="0.0.0.0", port=3000, debug=True)
