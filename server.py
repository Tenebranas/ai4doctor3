import os

from flask import Flask,  request, redirect, url_for, render_template
from main import training, prediction, analyze_table, data_store
import json

app = Flask(__name__, template_folder='static/templates', static_folder='static')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/training', methods=['POST'])
def search():

    print(request.values)
    input = request.values['input']
    output = request.values['output']
    type = request.values['type']
    print(input, output)
    print(request.files)
    file = request.files['file']
    print(file)

    filename = file.filename
    print(filename)
    file.save(filename)

    data_index, _, _ = analyze_table(filename)
    data = data_store[data_index]
    data.target = 8
    data.columns = [0, 1, 2, 3, 4, 5, 6, 7]
    data.type = int(type)
    result, data = training(data_index)
    return json.dumps((result, data))



if __name__ == "__main__":
    app.run(host= '0.0.0.0')