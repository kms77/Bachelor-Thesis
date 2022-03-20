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

@app.route("/data", methods=["GET", "POST"])
def get_data():
    request_data = request.json
    print('Hello world! + {}'.format(request_data), file=sys.stderr)
    message = request_data['message']
    return "<h3>The message is: {}</h3>".format(message)                              