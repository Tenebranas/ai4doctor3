# This is a sample Python script.

# Press Shift+F10 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

import pandas as pd
from sklearn.compose import make_column_selector as selector
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis, QuadraticDiscriminantAnalysis
from sklearn.linear_model import LinearRegression  # linear regression
from sklearn.compose import ColumnTransformer
from sklearn.naive_bayes import GaussianNB
from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.svm import SVR, SVC, NuSVC  # support vector regression
from sklearn.linear_model import SGDRegressor  # stochastic gradient descent regression
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier, AdaBoostClassifier, \
    GradientBoostingClassifier
from sklearn.linear_model import ElasticNet
from sklearn.model_selection import cross_val_score
from sklearn.tree import DecisionTreeClassifier


class Learning_Data:
    # override method
    def __init__(self):
        self.models = []
        self.target = 0
        self.columns = []
        self.data = pd.DataFrame()
        self.type = 0


data_store = []


def analyze_table(filepath):
    df = pd.read_csv(filepath)
    data = Learning_Data()
    data.data = df
    data_store.append(data)
    data_index = len(data_store) - 1
    return data_index, df.head(10), df.dtypes


print(analyze_table("diabetes.csv"))


def training(data_index):
    data = data_store[data_index]
    for c in data.data.columns:
        if data.data[c].dtype == "object":
            data.data[c] = data.data[c].astype("category")
    target = data.data.columns[data.target]
    y = data.data[target]
    picked_columns = [data.data.columns[index] for index in data.columns]
    X = data.data[picked_columns]
    regression_list = [SVR(), LinearRegression(), SGDRegressor(), GradientBoostingRegressor(), ElasticNet()]
    regression_names = ["Support Vector Regression", "Linear Regression", "Stochastic Gradient Descent Regression",
                        "SGD with Gradient Boosting", "Elastic Net"]
    classifications_list = [
        KNeighborsClassifier(3),
        SVC(kernel="rbf", C=0.025, probability=True),
        NuSVC(probability=True),
        DecisionTreeClassifier(),
        RandomForestClassifier(),
        AdaBoostClassifier(),
        GradientBoostingClassifier(),
        GaussianNB(),
        LinearDiscriminantAnalysis(),
        QuadraticDiscriminantAnalysis()]
    classifications_name = ["KNC", "SVC", "DTreeC", "RForestC", "ABC", "GBC", "GNB", "LDA", "QDA"]
    numeric_transformer = Pipeline(steps=[("imputer", SimpleImputer(strategy="median")), ("scaler", StandardScaler())])
    text_transformer = OneHotEncoder(handle_unknown="ignore")
    preprocessor = ColumnTransformer(transformers=[("num", numeric_transformer, selector(dtype_exclude="category")),
                                                   ("text", text_transformer, selector(dtype_include="category"))])
    # statement that checks what type we're doing from 0-1, set models to regression or classifcations and names to regression/class
    if data.type == 0:
        models = classifications_list
        names = classifications_name
    else:
        models = regression_list
        names = regression_names
    output = []
    final_models = []
    for model, name in zip(models, names):
        # Perform cross-validation using manual_model
        print(f"Model name: {name}")
        # Perform cross-validation using final_pipeline as model for automatic
        final_pipeline = Pipeline(steps=[("preprocessor", preprocessor), ("model", model)])
        automatic_model = final_pipeline
        if data.type == 0:
            scores_automatic = cross_val_score(automatic_model, X, y, cv=5, scoring="accuracy")
        else:
            scores_automatic = cross_val_score(automatic_model, X, y, cv=5, scoring="neg_root_mean_squared_error")
        print("Automatic: %0.2f accuracy with a standard deviation of %0.2f" % (
            scores_automatic.mean(), scores_automatic.std()))
        automatic_model.fit(X, y)
        final_models.append(automatic_model)
        output.append((name, scores_automatic.mean(), scores_automatic.std()))
    output.sort(key=lambda item: item[1], reverse=True)
    data.models = final_models
    return output, data_index


def prediction(filepath, model):
    to_predict = pd.read_csv(filepath)
    return model.predict(to_predict)

#
# data_index, _, _ = analyze_table("diabetes.csv")
# data = data_store[data_index]
# data.target = 8
# data.columns = [0, 1, 2, 3, 4, 5, 6, 7]
# data.type = 0
# result, data = training(data_index)
# print(result,data)
# print(prediction("diabetes_test.csv", data_store[data_index].models[0]))
# # homework:target_index - column index to predict, feature_indeces - column indeces to predict on
# # type - 0 means classification
# # type - 1 means regression
# # 1. get a subset of df (X,y) containing only appropriate columns (based off Lab 2)
# # 2. create the pipeline with the models that can process both text and numbers like in lab 3
# # 3. perform cross-validation using different models like in lab 3
# # 4. return a dict where the keys are model names and the values are accuracies
#
#
# # test data sets around to see which work and which dont
