from __future__ import print_function
from urllib import request
from flask import Flask, request
from flask_cors import CORS, cross_origin
import os
from flask import send_from_directory
from scraping.scraping import Scraping
from captioning.captioning import Captioning
import urllib
import asyncio


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

# @app.route("/data",methods = ['POST', 'GET'])
# @cross_origin()
# def get_data():
#     result= ""
#     if request.method == 'POST':
#         request_data = request.json
#         usernameCredentials = request_data['username']
#         passwordCredentials = request_data['password']
#         result = Scraping().scraping_data(usernameCredentials, passwordCredentials)
#         print("Result: ", result)
#     return result

@app.route("/images",methods = ['POST', 'GET'])
@cross_origin()
def get_images():
    # result = {}
    # allCaptions = []
    imageCaption = ""
    if request.method == 'POST':
        request_data = request.json
        imageURL = request_data['imageURL']
        # allImages = request_data['images']
        urllib.request.urlretrieve(imageURL, "./utils/image/image.jpg")
        imageCaption = Captioning().get_image_caption()
        os.remove("./utils/image/image.jpg")
    #     for src in allImages:
    #         urllib.request.urlretrieve(src, "./utils/image/image.jpg")
    #         imageCaption = Captioning().get_image_caption()
    #         os.remove("./utils/image/image.jpg")
    #         allCaptions.append(imageCaption)
    # print("\n")
    # print(allCaptions)
    # result['data'] = allCaptions
    print("Image Caption ----->  " + imageCaption)
    return imageCaption

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Main Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='utils/favicon.png')
                         