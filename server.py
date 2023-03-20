from flask import Flask, render_template, request
from main import training, prediction, analyze_table, data_store
import json
import pandas as pd

app = Flask(__name__,
            template_folder="static/templates",
            static_folder="static")


@app.route("/")
def home():
  return render_template("index.html")


@app.route("/app")
def hey():
  return render_template("app_index.html")


@app.route("/training", methods=["POST"])
def process_table():
  input = request.values["input"]
  output = request.values["output"]
  type = request.values["type"]
  print(input, output, type)
  file = request.files["file"]
  filename = file.filename
  file.save(filename)
  data_index, _, _ = analyze_table(filename)
  data = data_store[data_index]
  data.target = output
  data.columns = input.split(",")
  data.type = int(type)
  result, data = training(data_index)
  return json.dumps((result, data))


def getNumVals(list):
    new_list = []
    for i in list:
        try:
            new_list.append(float(i))
        except:
            try:
                new_list.append(int(i))
            except:
                new_list.append(i)
    return new_list


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    print(data)
    input_columns = data["form"]
    del input_columns[""]
    _in = getNumVals(list(input_columns.values()))
    print(_in)
    ed = pd.DataFrame([_in], columns=input_columns.keys())
    print(ed)
    output = data["output"]
    model_type = data["type"]
    algorithm = data["algorithm"]
    regression_names = [
        "Support Vector Regression", "Linear Regression",
        "Stochastic Gradient Descent Regression", "SGD with Gradient Boosting",
        "Elastic Net"
    ]
    classifications_name = [
        "KNC", "SVC", "DTreeC", "RForestC", "ABC", "GBC", "GNB", "LDA", "QDA"
    ]
    if model_type == "1":
        index = regression_names.index(algorithm)
    else:
        index = classifications_name.index(algorithm)
    model = data_store[-1].models[index]
    result = model.predict(ed)
    print(result)
    return json.dumps(result[0])


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)

