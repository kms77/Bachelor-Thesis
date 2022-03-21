from __future__ import print_function
from flask import Flask, request
from flask_cors import CORS, cross_origin
import os
from flask import send_from_directory

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route("/data",methods = ['POST', 'GET'])
@cross_origin()
def get_data():
    if request.method == 'POST':
        print(request)
        request_data = request.json
        print(request_data)
        message = request_data['message']
        return "<h3>The message is: {}</h3>".format(message)
    else:
        return "<h3>No post</h3>"   

@app.route("/",methods = ['POST', 'GET'])
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico',methods = ['POST', 'GET'])
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')
                         