import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from xgboost import XGBClassifier
import shap
import pickle

import base64
import io
import matplotlib.pyplot as plt
from PIL import Image

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Serve the Vite frontend files
@app.route('/')
def serve_frontend():
    return app.send_static_file('index.html')

# Example endpoint to interact with Python code
@app.route('/api/example', methods=['POST'])
def example_endpoint():
    # ~~~~~~~Load models and feature data~~~~~~~
    all_weather_conditions,all_timezones,ordering = pickle.load(open('One-Hot-Encoded_features_and_Ordering.pkl', 'rb'))
    scaler = pickle.load(open('Data_Scaler.pkl','rb'))
    reg_model = pickle.load(open('Regression_Model.pkl','rb'))
    bst = pickle.load(open('xgboost_model.pkl','rb'))
    # ~~~~~~~~Get data from the request~~~~~~~~~
    raw_data = request.json
    print("Before preprocessing:", raw_data)
    # ~~~~~~~~~Preprocess the data~~~~~~~~~~~~~~
    datapoint = pd.DataFrame([raw_data])
    # Convert start and end times to pandas datetime objects
    datapoint["Start_Time"] = pd.to_datetime(datapoint["Start_Time"], errors="coerce").astype("int64")
    datapoint["End_Time"] = pd.to_datetime(datapoint["End_Time"], errors="coerce").astype("int64")
    # Calculate duration
    datapoint["Duration"] = (datapoint["End_Time"] - datapoint["Start_Time"]).div(10**9)
    # Create one-hot-encoded columns for weather conditions
    for condition in all_weather_conditions:
        datapoint["Weather_Condition_"+condition] = (datapoint["Weather_Condition"] == condition).astype(int)
    # Create one-hot-encoded columns for timezones
    for timezone in all_timezones:
        datapoint["Timezone_"+timezone] = (datapoint["Timezone"] == timezone).astype(int)
    # Drop original columns
    datapoint.drop(columns=["Weather_Condition", "Timezone"], inplace=True)
    datapoint = datapoint[ordering]
    print("Preprocessing Complete")
    # ~~~~~~~~~~~~~Run prediction~~~~~~~~~~~~~~~
    # Severity Score
    scaled_features = scaler.transform(datapoint)
    severity_score = reg_model.predict(scaled_features)
    # Severity Likelihood
    probabilities = bst.predict_proba(datapoint)
    # Severity labels
    class_labels = [i+1 for i in range(len(probabilities[0]))]
    # Create a pie chart
    plt.figure(figsize=(8, 6))  # Adjust the figure size as needed
    plt.pie(probabilities[0], labels=class_labels, autopct='%1.1f%%', startangle=90)
    plt.title('Accident Severity Probabilities')
    # Save the pie chart as an image
    #plt.savefig('./prob_result.png')
    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format='png')
    probability_pie_chart = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
    #probability_pie_chart = img_base64
    #Jsonify
    print("Prediction complete")
    result = {
        "severity_score": severity_score.tolist(),
        "severity_probabilities": probability_pie_chart
    }
    response = app.make_response(jsonify(result))
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

if __name__ == '__main__':
    app.run(port = 5001, debug=True)
