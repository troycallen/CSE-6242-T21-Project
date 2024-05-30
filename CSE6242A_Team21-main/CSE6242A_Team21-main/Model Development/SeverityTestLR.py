# Import necessary libraries
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import shap

# Load the dataset
url = "https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents"
df = pd.read_csv(url)

# Feature selection (choose relevant columns)
selected_features = ["Weather_Condition", "Road_Type", "Timezone", "Severity"]

# Preprocessing: Handle missing values, encode categorical features, etc.
df = df[selected_features].dropna()
df = pd.get_dummies(df, columns=["Weather_Condition", "Road_Type", "Timezone"])

# Split data into train and test sets
X = df.drop(columns=["Severity"])
y = df["Severity"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Standardize features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train a logistic regression model
model = LogisticRegression()
model.fit(X_train_scaled, y_train)

# Evaluate model performance (you can use other metrics as well)
accuracy = model.score(X_test_scaled, y_test)
print(f"Accuracy: {accuracy:.2f}")

# Calculate SHAP values
explainer = shap.Explainer(model, X_train_scaled)
shap_values = explainer(X_test_scaled)

# Visualize feature importance
shap.summary_plot(shap_values, X_test_scaled, feature_names=X.columns)
