import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array, load_img
import io
from PIL import Image
import db_config
import mysql.connector
from datetime import datetime

app = Flask(__name__)
CORS(app)

# --- ML Model Setup ---
# Fix: Construct absolute path to model file
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'tumor_trace.h5')
# MODEL_PATH = 'tumor_trace.h5' # Old incorrect path
model = None
CLASS_LABELS = ['notumor', 'pituitary', 'meningioma', 'glioma']  # Adjusted order

def load_neuro_model():
    global model
    try:
        model = load_model(MODEL_PATH)
        print("Model loaded successfully.")
        print("Model summary:")
        model.summary()  # Print model architecture
    except Exception as e:
        print(f"Error loading model: {e}")

# Call load model on startup
load_neuro_model()

def preprocess_image(image, target_size=(128, 128)):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = image / 255.0
    image = np.expand_dims(image, axis=0)
    return image

# --- Business Logic / Mapping ---
def get_tumor_info(label):
    if label == 'glioma':
        return {
            "stage": "High-grade / Aggressive",
            "symptoms": ["Headaches", "Seizures", "Memory loss", "Personality changes"]
        }
    elif label == 'pituitary':
        return {
            "stage": "Usually Benign",
            "symptoms": ["Vision problems", "Hormonal imbalance", "Fatigue", "Headaches"]
        }
    elif label == 'meningioma':
        return {
            "stage": "Slow-growing / Benign",
            "symptoms": ["Headache", "Vision issues", "Weakness in limbs", "Seizures"]
        }
    else: # notumor
        return {
            "stage": "N/A",
            "symptoms": ["No abnormal symptoms detected"]
        }

# --- Routes ---

@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        conn = db_config.get_db_connection()
        cursor = conn.cursor()
        
        # Simple query (in production use hashing!)
        query = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (username, email, password))
        conn.commit()
        
        cursor.close()
        conn.close()
        return jsonify({"message": "User registered successfully"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')

        conn = db_config.get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM users WHERE email = %s AND password = %s"
        cursor.execute(query, (email, password))
        user = cursor.fetchone()
        
        cursor.close()
        conn.close()

        if user:
            return jsonify({"message": "Login successful", "user": user['username']}), 200
        else:
            return jsonify({"message": "Invalid credentials"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({"error": "No image part"}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)
        print(f"Processed image shape: {processed_image.shape}")  # Debug

        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        predictions = model.predict(processed_image)
        print(f"Predictions: {predictions}")  # Debug: print raw predictions
        predicted_class_index = np.argmax(predictions, axis=1)[0]
        confidence_score = float(np.max(predictions, axis=1)[0]) * 100
        
        # Get top 2 predictions
        top2_indices = np.argsort(predictions[0])[-2:][::-1]
        top2_labels = [CLASS_LABELS[i] for i in top2_indices]
        top2_confidences = [float(predictions[0][i] * 100) for i in top2_indices]
        
        print(f"Top predictions: {top2_labels} with confidences {top2_confidences}%")  # Debug
        
        print(f"Predicted class index: {predicted_class_index}, Confidence: {confidence_score}%")  # Debug
        
        # If confidence is low, classify as notumor
        if confidence_score < 70:
            predicted_label = 'notumor'
        else:
            predicted_label = CLASS_LABELS[predicted_class_index]
        
        predicted_label = CLASS_LABELS[predicted_class_index]
        info = get_tumor_info(predicted_label)

        result = {
            "tumor_type": predicted_label if predicted_label != 'notumor' else "No Tumor Detected",
            "confidence": f"{confidence_score:.2f}%",
            "stage": info['stage'],
            "symptoms": info['symptoms']
        }
        
        # Optionally save to patients table (Mocking this part as per req, or saving basic record)
        # We'll skip saving to DB for this specific route unless requested, 
        # but User asked for "Patient Records (Admin mock table)", so maybe we save it?
        # The requirements say "patients table (mock)", so I'll just save it to be safe/useful.
        try:
            conn = db_config.get_db_connection()
            cursor = conn.cursor()
            date_str = datetime.now().strftime('%Y-%m-%d')
            # Mock patient name for now or pass in request
            patient_name = request.form.get('patient_name', 'Unknown') 
            
            insert_query = "INSERT INTO patients (name, tumor_type, confidence, date) VALUES (%s, %s, %s, %s)"
            cursor.execute(insert_query, (patient_name, result['tumor_type'], result['confidence'], date_str))
            conn.commit()
            cursor.close()
            conn.close()
        except Exception as db_e:
            print(f"Failed to log to database: {db_e}")

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/patients', methods=['GET'])
def get_patients():
    try:
        conn = db_config.get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM patients")
        rows = cursor.fetchall()
        cursor.close()
        conn.close()
        return jsonify(rows)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
