import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBrain } from 'react-icons/fa';
import axios from 'axios';
import './Auth.css';

const API_BASE = 'http://localhost:5000';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/login`, formData);
      if (response.status === 200) {
        onLogin(response.data.user);
        setMessage('Login successful!');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <FaBrain className="brain-icon" />
          <h2>Welcome Back</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {message && <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>{message}</div>}
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;