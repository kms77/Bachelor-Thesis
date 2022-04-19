from __future__ import print_function
from urllib import request
from flask import Flask, request
from flask_cors import CORS, cross_origin
import os
from flask import send_from_directory
from scraping.scraping import Scraping

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/data",methods = ['POST', 'GET'])
@cross_origin()
def get_data():
    result= ""
    if request.method == 'POST':
        request_data = request.json
        usernameCredentials = request_data['username']
        passwordCredentials = request_data['password']
        print("usernameCredentials: ", usernameCredentials)
        print("passwordCredentials: ", passwordCredentials)
        result = Scraping().scraping_data(usernameCredentials, passwordCredentials)
        print("Result: ", result)
    return result

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Main Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='utils/favicon.png')
                         