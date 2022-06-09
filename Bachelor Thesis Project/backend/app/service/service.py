from __future__ import print_function
from urllib import request
from flask import Flask, request
from flask_cors import CORS, cross_origin
from flask import send_from_directory
from captioning.captioning import Captioning
import urllib
import os

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

"""
Method which triggers when the '\image' route is accessed.  
A JSON which contains the image URL is received if the request was done through a 'POST' request method.
The image is downloaded in 'image' package and then processed. In the end, a caption of the image is returned.
:param : none
:return imageCaption: a string which is the caption of the received image
"""
@app.route("/image",methods = ['POST', 'GET'])
@cross_origin()
def get_image():
    imageCaption = ""
    if request.method == 'POST':
        request_data = request.json
        imageURL = request_data['imageURL']
        urllib.request.urlretrieve(imageURL, "./utils/image/image.jpg")
        imageCaption = Captioning().get_image_caption()
        os.remove("./utils/image/image.jpg")
    return imageCaption

"""
Method which triggers when the main page of the application is accessed.
:param : none
:return : a string which is the message that will be shown on the main page of the application
"""
@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Main Page</h1>"

"""
Method which is done in order to prevent an error.
:param : none
:return : an action which prevents the error
"""
@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='utils/favicon.png')