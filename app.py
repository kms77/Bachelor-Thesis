from flask import Flask
import os
from flask import send_from_directory

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/favicon.png')

@app.route('/home')
def home():
    return "Hello World Home"

@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World ROOT!'




if __name__ == '__main__':
    app.run()
