from __future__ import print_function
import sys
from flask import Flask, request
import os
from flask import send_from_directory

app = Flask(__name__)

@app.route("/")
def root_page():
    return "<h1>Root Page</h1>"

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')

@app.route("/data/")
def get_data():
    requested_data = request.get_json()
    print('Hello world! + {}'.format(requested_data), file=sys.stderr)
    message = requested_data['message']
    return "<h3>The message is: {}</h3>".format(message)                              