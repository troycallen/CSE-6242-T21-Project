import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import shap

# Load the dataset (replace with actual data loading)
url = "https://www.kaggle.com/datasets/sobhanmoosavi/us-accidents"
df = pd.read_csv(url)

# Feature selection and preprocessing (similar to previous steps)
selected_features = ["Weather_Condition", "Road_Type", "Timezone", "Severity"]
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

# Build a simple neural network
model = tf.keras.Sequential([
    tf.keras.layers.Dense(64, activation='relu', input_shape=(X_train_scaled.shape[1],)),
    tf.keras.layers.Dense(32, activation='relu'),
    tf.keras.layers.Dense(1, activation='sigmoid')  # Binary classification
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model
model.fit(X_train_scaled, y_train, epochs=10, batch_size=32, validation_split=0.2)

# Evaluate model performance
accuracy = model.evaluate(X_test_scaled, y_test)[1]
print(f"Accuracy: {accuracy:.2f}")

# Calculate SHAP values
explainer = shap.Explainer(model, X_train_scaled)
shap_values = explainer(X_test_scaled)

# Visualize feature importance
shap.summary_plot(shap_values, X_test_scaled, feature_names=X.columns)
