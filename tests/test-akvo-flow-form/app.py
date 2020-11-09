from flask import Flask, jsonify, render_template
from flask_socketio import SocketIO, emit
from subprocess import Popen, PIPE

import logging
import threading

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
        line = line.decode('utf-8')
        bthread(line, 'output')
    for line in iter(cmd.stderr.readline, b''):
        line = line.decode('utf-8')
        bthread(line, 'error')
    return True

def startUpdate():
    global test_is_running
    try:
        try:
            bthread("\n--- TEST IS RUNNING ---\n", 'output')
            test_is_running = True
            processing("./run.sh")
        except:
            bthread("\n--- INTERNAL SERVER ERROR ---\n", 'error')
    finally:
        bthread("", 'output')
        bthread("\n--- TEST COMPLETED ---\n", 'output')
        test_is_running = False
        bthread("\n--- EXIT ---\n", 'output')
    return True


@app.route("/")
def main():
    return render_template("app.html", data={"job": False}, sync_mode=socketio.async_mode)

@app.route("/update")
def update():
    if test_is_running is False:
        update_thread = threading.Thread(target=startUpdate)
        update_thread.run()
        return jsonify({"response": True})
    return jsonify({"response": True})


if __name__ == "__main__":
    app.config.update(DEBUG=True)
    socketio.run(app, host="0.0.0.0", port=3000, debug=True)
