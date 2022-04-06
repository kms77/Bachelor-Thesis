from __future__ import print_function
import urllib
from urllib import request
from flask import Flask, request
from flask_cors import CORS, cross_origin
import os
from flask import send_from_directory
from app.captioning.captioning import Captioning

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/data",methods = ['POST', 'GET'])
@cross_origin()
def get_data():
    received_data = "Still no data received!"
    image_caption = ""
    if request.method == 'POST':
        request_data = request.json
        received_data = request_data['image_URL']
        try:
            urllib.request.urlretrieve(received_data, "./app/utils/image/image.jpg")
        except urllib.error:
            return "Could not download image"
        image_caption = Captioning().get_image_caption()
        os.remove("./app/utils/image/image.jpg")
    return image_caption

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='utils/favicon.png')
                         