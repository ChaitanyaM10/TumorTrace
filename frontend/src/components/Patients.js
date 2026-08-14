import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaUpload, FaSearch, FaCalendarAlt } from 'react-icons/fa';
import axios from 'axios';
import './Patients.css';

const API_BASE = 'http://localhost:5000';

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await axios.get(`${API_BASE}/patients`);
      setPatients(response.data);
    } catch (error) {
      setMessage('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.tumor_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="patients-page">
      <nav className="nav-bar">
        <div className="nav-links">
          <Link to="/dashboard" className="nav-link">
            <FaUpload /> Dashboard
          </Link>
          <Link to="/patients" className="nav-link active">
            <FaUsers /> Patients
          </Link>
        </div>
      </nav>

      <div className="patients-content">
        <div className="page-header">
          <h1>Patient Records</h1>
          <p>View and manage patient analysis history</p>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or tumor type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchPatients} className="refresh-btn">
            Refresh Data
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading patient records...</div>
        ) : message ? (
          <div className="message error">{message}</div>
        ) : (
          <div className="patients-grid">
            {filteredPatients.length === 0 ? (
              <div className="no-patients">
                <FaUsers className="no-data-icon" />
                <h3>No patient records found</h3>
                <p>Upload some MRI images to get started</p>
              </div>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="patient-card">
                  <div className="patient-header">
                    <h3>{patient.name}</h3>
                    <span className={`tumor-badge ${patient.tumor_type.toLowerCase().replace(' ', '-')}`}>
                      {patient.tumor_type}
                    </span>
                  </div>
                  <div className="patient-details">
                    <div className="detail-row">
                      <FaCalendarAlt className="detail-icon" />
                      <span>{patient.date}</span>
                    </div>
                    <div className="confidence-bar">
                      <span>Confidence: {patient.confidence}</span>
                      <div className="confidence-fill" style={{ width: patient.confidence }}></div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Patients;