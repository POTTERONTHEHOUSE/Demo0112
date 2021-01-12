from flask import Flask, request, url_for, render_template, jsonify, redirect
import os, sys, json, socket, random, time, uuid
import threading
import argparse
from setting import *
from typing import Any

token_lock = threading.Lock()
token_holding = False  # type: Any
uuid = uuid.uuid1()

galaxy_conn = None
s = None

app = Flask(__name__)

@app.route('/', methods=['GET'])



@app.route('/realtimedemo', methods=['GET'])
def realtimedemo():
    return render_template('realtimedemo.html')    


@app.route('/start_task', methods=['POST'])
def start_task():
    req_data = request.get_json()
    dataset = req_data['dataset']
    workload = req_data['workload']
    algorithm = req_data['algorithm']
    num_of_machines = req_data['num_of_machines']
    system = req_data['system']
    tmp_uuid = req_data['uuid']
    print(tmp_uuid)
    global token_holding
    global uuid
    global galaxy_conn
    if token_holding:
        return jsonify(result={"status":"started by other users"})
    elif galaxy_conn == None:
        return jsonify(result={"status":"proxy notprepared"})
    else:
        token_lock.acquire()
        token_holding = True
        uuid = tmp_uuid
        token_lock.release()
        galaxy_conn.sendall(json.dumps(req_data).encode())
        return jsonify(result={"status":"Okay"})

@app.route('/status_query', methods=['POST'])
def status_query():
    global token_holding
    req_data = request.get_json()
    tmp_uuid =req_data['uuid']
    if not token_holding:
        return jsonify(result=[{"phase":"not started"}])
    elif tmp_uuid != uuid:
        return jsonify(result=[{"phase":"started by other users"}])
    elif galaxy_conn == None:
        return jsonify(result=[{"phase":"proxy notprepared"}])
    else:
        galaxy_conn.recv(4096).decode()
        galaxy_conn.sendall("status_query".encode())
        msg = galaxy_conn.recv(4096).decode()
        result = json.loads(msg)
        for tmp_result in result:
            if tmp_result["phase"] == "end":
                token_lock.acquire()
                token_holding = False
                token_lock.release()
                break
        return jsonify(result=result)



def galaxy_connector():
    global s
    global galaxy_conn
    s = socket.socket()
    s.bind(('',PROXY_PORT))
    print("Proxy Server starts. Waiting messages from galaxy manager...")

    s.listen(1)
    galaxy_conn, addr = s.accept()
    msg = galaxy_conn.recv(4096).decode()
    print("Connection established")


def isPortValid(port):
    return port >= 0 and port <= 65535


def main(port):
    app.run(host= '0.0.0.0', debug=DEBUG, port=port, threaded=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('-P','--port', type=int, help='webserver port number',default=80)
    args = parser.parse_args()
    # check valid port number:
    _port = int(args.port)
    if not isPortValid(_port):
        print(_port)
        print("Invalid port number: port number should be between 0 and 65535")
        exit()

    galaxy_proxy = threading.Thread(target=galaxy_connector)
    galaxy_proxy.start()
    main(_port)
