from flask import Flask
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

@app.route("/data")
def get_data():
    return "<h3>Here we get the data!</h3>"                              