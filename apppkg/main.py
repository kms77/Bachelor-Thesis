from __future__ import print_function
from flask import Flask, request
import os
from flask import send_from_directory

app = Flask(__name__)

@app.route("/data/")
def get_data():
    
    #request_data = request.json
    #message = request_data['message']
    return "<h3>The message is</h3>"   

@app.route("/")
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')
                         