from __future__ import print_function

import json
import urllib
from urllib import response, request

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
    received_data = "still no data received!"
    if request.method == 'POST':
        request_data = request.json
        received_data = request_data['image_URL']
        try:
            urllib.request.urlretrieve(received_data, "C:/Users/komsa/OneDrive/Desktop/Test Applications/Heroku-Test-Application/image/image.jpg")
        except urllib.error:
            return "Could not download image"
        print(received_data)
    return "The image URL is: " + received_data

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')
                         