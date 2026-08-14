import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUpload, FaFileMedical, FaUsers, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import './Dashboard.css';

const API_BASE = 'http://localhost:5000';

function Dashboard() {
  const [file, setFile] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select an image');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('patient_name', patientName || 'Unknown');

    try {
      const response = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link active">
            <FaUpload /> Dashboard
          </Link>
          <Link to="/patients" className="nav-link">
            <FaUsers /> Patients
          </Link>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="hero-section">
          <div className="hero-text">
            <h1>Advanced Brain Tumor Detection</h1>
            <p>Upload MRI scans for instant AI-powered analysis</p>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <FaChartLine className="stat-icon" />
              <div>
                <h3>98%</h3>
                <p>Accuracy</p>
              </div>
            </div>
            <div className="stat-card">
              <FaFileMedical className="stat-icon" />
              <div>
                <h3>4 Types</h3>
                <p>Detection</p>
              </div>
            </div>
          </div>
        </div>

        <div className="upload-section">
          <div className="upload-card">
            <h2>Upload MRI Image</h2>
            <form onSubmit={handleSubmit} className="upload-form">
              <div className="form-row">
                <div className="input-group">
                  <label>Patient Name (Optional)</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                  />
                </div>
              </div>
              <div className="file-upload">
                <input
                  type="file"
                  id="file-input"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="file-input" className="file-label">
                  <FaUpload className="upload-icon" />
                  <span>{file ? file.name : 'Choose MRI Image'}</span>
                </label>
              </div>
              <button type="submit" className="analyze-btn" disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </button>
            </form>
            {message && <div className="message error">{message}</div>}
          </div>
        </div>

        {result && (
          <div className="results-section">
            <div className="result-card">
              <div className="result-header">
                <FaFileMedical className="result-icon" />
                <h3>Analysis Results</h3>
              </div>
              <div className="result-content">
                <div className="result-main">
                  <div className="result-type">
                    <h4>{result.tumor_type}</h4>
                    <span className="confidence">{result.confidence} confidence</span>
                  </div>
                  {result.stage !== 'N/A' && (
                    <div className="result-details">
                      <div className="detail-item">
                        <strong>Stage:</strong> {result.stage}
                      </div>
                      <div className="detail-item">
                        <strong>Symptoms:</strong>
                        <ul>
                          {result.symptoms.map((symptom, index) => (
                            <li key={index}>{symptom}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;