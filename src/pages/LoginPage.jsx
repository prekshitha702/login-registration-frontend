import React, { useState } from 'react';
import { authService } from '../services/authService';

export default function LoginPage({ onNavigateToRegister, onLoginSuccess, initialUsername = '' }) {
  const [formData, setFormData] = useState({
    username: initialUsername,
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim() || !formData.password) {
      setError('Please provide your username/email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password,
      });

      if (onLoginSuccess) {
        onLoginSuccess(response.data);
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel auth-card">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
        <span className="service-badge badge-login">
          <span className="status-dot"></span> Login Service :8082 &bull; jwttable
        </span>
      </div>

      <div className="auth-header">
        <h1>Welcome Back</h1>
        <p>Sign in with your credentials to access your session</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Username or Email</label>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </span>
            <input
              type="text"
              name="username"
              className="form-input"
              placeholder="Username or user@example.com"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="form-label">
            <span>Password</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>
          <div className="input-wrapper">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </span>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <input type="checkbox" id="rememberMe" style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }} />
          <label htmlFor="rememberMe" style={{ cursor: 'pointer' }}>Remember this device</label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? (
            <>
              <div className="spinner"></div>
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </>
          )}
        </button>
      </form>

      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
        Don't have an account?{' '}
        <button
          onClick={onNavigateToRegister}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-secondary)',
            cursor: 'pointer',
            fontWeight: 600,
            textDecoration: 'underline'
          }}
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
