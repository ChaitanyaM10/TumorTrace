# TumorTrace 🧠

A machine learning-powered web application for brain tumor detection and classification using MRI scan analysis.

## Overview

TumorTrace is an educational AI-driven application that leverages convolutional neural networks to analyze MRI brain scans and classify potential tumor types. The application provides a user-friendly interface for medical professionals and researchers to upload MRI images and receive AI-assisted predictions with confidence metrics.

## Problem Statement

Brain tumors are a critical health concern requiring rapid and accurate diagnosis. Manual analysis of MRI scans is time-consuming and can be subject to human error. TumorTrace aims to assist in the diagnostic process by providing automated, AI-powered analysis of brain MRI scans to support medical decision-making.

## Key Features

- **MRI Image Upload**: Easy-to-use interface for uploading brain MRI scan images
- **AI-Powered Classification**: VGG16-based deep learning model for tumor classification
- **4-Class Tumor Detection**: Classifies brain scans into:
  - No Tumor
  - Glioma (High-grade / Aggressive)
  - Meningioma (Slow-growing / Benign)
  - Pituitary (Usually Benign)
- **Confidence Metrics**: Displays prediction confidence for model transparency
- **Patient Record Management**: Stores and retrieves patient analysis history
- **User Authentication**: Secure login and registration system
- **Responsive UI**: Modern React-based frontend with professional styling

## Technologies Used

- **Frontend**: React.js, React Router, Axios, React Icons
- **Backend**: Python, Flask, Flask-CORS
- **Machine Learning**: TensorFlow/Keras, NumPy
- **Database**: MySQL
- **Image Processing**: Pillow (PIL)
- **Environment Management**: python-dotenv

## Machine Learning Approach

### Model Architecture
The application uses a pre-trained **VGG16** convolutional neural network as the backbone, featuring:
- VGG16 base model with pre-trained ImageNet weights (14.7M parameters)
- Flatten layer for dimensionality reduction
- Dropout layers (2) for regularization
- Dense hidden layer (128 units) for feature extraction
- Output layer (4 units) for multi-class classification
- **Total parameters**: 15.76M (60.13 MB)

### Classification Approach
- Input images are normalized to 128x128 pixels in RGB format
- Pixel values are normalized to [0, 1] range
- The model outputs probability scores for each tumor class
- Predictions include confidence metrics for each classification

### Dataset
The model was trained on brain MRI scans from a medical imaging dataset. The dataset includes balanced examples of:
- No tumor (negative control)
- Glioma tumors
- Meningioma tumors
- Pituitary tumors

**Note**: The training dataset is NOT included in this repository due to size constraints and licensing considerations.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend                           │
│              (http://localhost:3000)                        │
│         • Login/Registration                                │
│         • MRI Image Upload                                  │
│         • Patient Dashboard                                 │
│         • Patient Records & History                         │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/CORS
┌────────────────────▼────────────────────────────────────────┐
│                    Flask Backend                            │
│              (http://localhost:5000)                        │
│         • Authentication Routes                             │
│         • Image Processing Pipeline                         │
│         • Model Inference Endpoint                          │
│         • Patient Data Management                           │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│              TensorFlow/Keras ML Model                      │
│         • VGG16-based Tumor Classification                  │
│         • 4-Class Output (Tumor Type)                       │
│         • Confidence Metrics                                │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   MySQL Database                            │
│         • User Credentials (authentication)                 │
│         • Patient Records (analysis history)                │
│         • MRI Analysis Results                              │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
TumorTrace-GitHub/
├── backend/                       # Flask backend application
│   ├── app.py                    # Main Flask app & API routes
│   ├── db_config.py              # Database configuration (uses env vars)
│   ├── init_db.py                # Database initialization script
│   ├── schema.sql                # MySQL database schema
│   ├── requirements.txt           # Python dependencies
│   ├── tumor_trace.h5            # Pre-trained ML model (git-ignored)
│   └── client.py                 # MySQL client utilities
│
├── frontend/                      # React frontend application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Dashboard.js     # MRI upload & prediction
│   │   │   └── Patients.js      # Patient records viewer
│   │   ├── App.js               # Main App routing
│   │   ├── index.js             # React entry point
│   │   └── *.css                # Component styles
│   ├── public/                   # Static assets
│   ├── package.json              # Node.js dependencies
│   └── build/                    # Production build (git-ignored)
│
├── Kaggle Dataset/              # Training & testing dataset (git-ignored)
│   ├── Training/                # Training data
│   └── Testing/                 # Test data
│
├── Neuro_model.ipynb            # Jupyter notebook for model training
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── LICENSE                      # MIT License
```

## Dataset

The project uses a brain MRI dataset organized into training and testing folders, with four tumor classification categories:
- **Glioma**: High-grade aggressive tumors
- **Meningioma**: Slow-growing benign tumors
- **Pituitary**: Usually benign endocrine gland tumors
- **No Tumor**: Normal brain scans (negative control)

**Dataset Status**: The dataset is NOT included in this public GitHub repository due to size constraints and licensing considerations. Developers need to:
1. Download the dataset from appropriate sources (e.g., Kaggle)
2. Place it in the `Kaggle Dataset/` folder locally
3. The dataset structure should match the existing directory layout

## Model

The pre-trained TensorFlow/Keras model (`tumor_trace.h5`) is excluded from the GitHub repository due to its large file size (~60 MB). 

**To use this project locally:**
1. The model file must be placed at: `backend/tumor_trace.h5`
2. The model is already loaded in `backend/app.py` on application startup
3. For development, you can:
   - Train your own model using the Jupyter notebook (`Neuro_model.ipynb`)
   - Or obtain the model file through project maintainers

**Important**: Do not attempt to commit the model file to the repository.

## Installation

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 5.7+
- Git

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/TumorTrace.git
cd TumorTrace
```

### Step 2: Set Up Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your local database credentials
# For local development:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_mysql_password
# DB_NAME=tumortrace_db
```

### Step 3: Set Up MySQL Database
```bash
# Create the database and tables using the schema
mysql -u root -p < backend/schema.sql

# Or run the initialization script after installing Python dependencies
```

### Step 4: Set Up Python Backend
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt

# Initialize database (optional, if not done via mysql command)
python backend/init_db.py
```

### Step 5: Set Up React Frontend
```bash
cd frontend

# Install Node.js dependencies
npm install

# Return to root directory
cd ..
```

### Step 6: Obtain the ML Model and Dataset
- **Model**: Place `tumor_trace.h5` in the `backend/` directory
  - You can train your own using `Neuro_model.ipynb`
  - Size: ~60 MB (not in repository)
  
- **Dataset**: Download brain MRI dataset and place in `Kaggle Dataset/` folder
  - Organize into `Training/` and `Testing/` subdirectories
  - Each with tumor type subdirectories: `glioma/`, `meningioma/`, `pituitary/`, `notumor/`
  - Size: ~2+ GB (not in repository)

## Running the Application

### Terminal 1: Start the Flask Backend
```bash
cd backend
python app.py
```
The backend will start on `http://127.0.0.1:5000`

### Terminal 2: Start the React Frontend
```bash
cd frontend
npm start
```
The frontend will start on `http://localhost:3000`

### Access the Application
Open your browser and navigate to: **http://localhost:3000**

### First-Time Usage
1. Create a new account via the Registration page
2. Log in with your credentials
3. Navigate to the Dashboard
4. Upload an MRI brain scan image (PNG, JPG, JPEG)
5. View the prediction results and confidence metrics
6. Access patient records from the Patients page

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost          # MySQL host
DB_USER=root               # MySQL username
DB_PASSWORD=your_password  # MySQL password (use strong password)
DB_NAME=tumortrace_db      # Database name

# Optional: Flask Configuration
FLASK_ENV=development      # development or production
FLASK_DEBUG=1              # Set to 0 for production

# Optional: Frontend Configuration
REACT_APP_API_URL=http://localhost:5000  # Backend API URL
```

**Important**: 
- Never commit `.env` to version control
- Use `.env.example` as a template for other developers
- Keep sensitive credentials secure and private

## Troubleshooting

### MySQL Connection Errors
- Ensure MySQL is running
- Verify database credentials in `.env` file
- Check if the `tumortrace_db` database exists
- Confirm the user has necessary permissions

### Model Loading Errors
- Ensure `tumor_trace.h5` exists in `backend/` directory
- Check TensorFlow/Keras version compatibility
- Verify Python environment has all dependencies installed

### Frontend Not Loading
- Ensure backend is running on port 5000
- Check browser console for CORS or connection errors
- Verify Node.js dependencies are installed: `npm install`

### Port Already in Use
- Backend (5000): `lsof -i :5000` and kill the process
- Frontend (3000): `lsof -i :3000` and kill the process
- Or change ports in configuration files

## Disclaimer

**IMPORTANT**: TumorTrace is an **educational and research project** and is **NOT a medical diagnostic tool**. 

⚠️ **Key Points**:
- Predictions from this application should NOT be used as a substitute for professional medical diagnosis
- Always consult qualified medical professionals for actual diagnostic decisions
- The model's predictions are for educational purposes only
- This application has not been validated for clinical use
- No liability is assumed for any medical decisions based on this application's output

## Contributing

This project welcomes contributions, bug reports, and suggestions. Please:
1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Submit a pull request

## Future Improvements

- Add model explainability features (activation maps, Grad-CAM)
- Implement batch processing for multiple images
- Add 3D MRI support
- Enhance the ML model with transfer learning from more recent architectures
- Implement data augmentation for better generalization
- Add DICOM image format support
- Implement automated model retraining pipeline
- Add multi-language support
- Implement role-based access control (admin, doctor, patient)
- Add export functionality for medical reports

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Chaitanya Maskare**

---

**Last Updated**: August 2026
**Project Status**: Educational/Development
**Disclaimer**: For educational purposes only. Not for clinical use.
