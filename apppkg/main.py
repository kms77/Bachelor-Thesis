from __future__ import print_function

import json
from urllib import response

from flask import Flask, request, Response
from flask_cors import CORS, cross_origin
import os
from flask import send_from_directory

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/data",methods = ['POST', 'GET'])
@cross_origin()
def get_data():
    message = "still no data"
    if request.method == 'POST':
        request_data = request.json
        print(request_data)
        message = request_data['message']
        print(message)
        print(format(message))
    return "Success! The server got message: " + message

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')
                         