# US Traffic Accident WebApp

A web application to provide users with information related to accident severity and likelihood and how they are affected by weather conditions, road features, time of day, and more.

Description

This package contains the code needed to locally run our project’s website. This includes the frontend UI, the backend model-prediction and publishing code, and saved models, data, and old code that was developed in the process of this website’s creation.
There are only two folders in this package. “frontend_experiment” contains our code for deploying the website to a localhost and contains the details of the frontend implementations. “Model Development” contains relic code on past experiments with various types of ML models on our data.
As for individual files that are required to run the website, we have the following:

• backend.py: the Flask endpoint code that receives get/put calls from the frontend, preprocesses the retrieved datapoint, feeds it into our ML models, and publishes the model output to the frontend. This file must be running in order for the website to properly receive predictions to the user’s input.
The following are pickle files that saved models and other information for backend.py to use.

• Regression_Model.pkl: the saved model used by backend.py to predict the accident severity scores.

• xgboost_model.pkl: the saved model used by backend.py to predict the likelihood of each severity score category.

• One-Hot-Encoded_features_and_Ordering.pkl: this saved pickle file contains the list of timezone categories, weather condition categories, and ordering of features for data. This aids backend.py with preprocessing a datapoint it receives from the frontend, as it ensures that all one-hot-encoded features are present, not just the ones found in the datapoint.


Installation

1. Open the CSE6242A_Team21-main folder in your preferred IDE. IDE must support HTML, CSS, Javascript, and Python. So we recommend using Visual Studio Code. I will call this VSCode window as Window 1.

2. Open the folder frontend_experiment in a second window of Visual Studio Code. This is for ease of use. I will call this Window 2.

3. In Window 2, add a new file called .env.local. You will need to add a google maps api key here by typing "VITE_GOOGLE_API_KEY=put_your_api_key_here". We recommend using this youtube video for setting up your google api key: https://www.youtube.com/watch?v=hsNlz7-abd0

4. For those who are running the backend code for the first time, open Window 1. Open a new terminal and type in "pip install xgboost == 1.7.6" to install xgboost. Then type in "pip install scikit-learn == 1.2.2" to install scikit-learn. For all other required imports, use "pip install library-name-here". Finally type in "python backend.py" to run the backend code.


5. For those who are running the frontend code for the first time, open Window 2. Open a new terminal and type in "yarn install" to install all dependencies. Then type in "yarn run dev".

6. Now if you open the link that is shown by the terminal after the previous step, you will see the website fully working.


Execution

Once all the installation steps have been complete:

1. Input a route by clicking on the Google Map once for a starting location. Click again on an ending location of your choice. The Google Map will create a route for you. 

2. Input the next parameters.

3. Click submit to see the ML model results.

4. Interact with the Tableau dashboard to see other historical trends of US traffic accidents




