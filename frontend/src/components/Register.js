import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';

const API_BASE = 'http://localhost:5000';

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE}/register`, formData);
      setMessage('Registration successful! Please login.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaBrain className="brain-icon" />
          <h2>Join Us</h2>
          <p>Create your account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;