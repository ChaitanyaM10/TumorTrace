import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Patients from './components/Patients';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
  const [user, setUser] = useState(localStorage.getItem('user'));

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUser(username);
    localStorage.setItem('user', username);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-content">
            <h1 className="app-title">🧠 Brain Tumor Detection</h1>
            {isLoggedIn && (
              <div className="user-section">
                <span className="welcome-text">Welcome, {user}</span>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </div>
            )}
          </div>
        </header>
        <main className="main-content">
          <Routes>
            <Route path="/login" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleLogin} />} />
            <Route path="/register" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
            <Route path="/patients" element={isLoggedIn ? <Patients /> : <Navigate to="/login" />} />
            <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
