import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export default function HomePage({ user, onNavigateToLogin, onNavigateToRegister, onLogout }) {
  const [regServiceUp, setRegServiceUp] = useState(null);
  const [loginServiceUp, setLoginServiceUp] = useState(null);
  const [tokenValidation, setTokenValidation] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check health of microservices
    const checkServices = async () => {
      const regOk = await authService.checkRegistrationHealth();
      const loginOk = await authService.checkLoginHealth();
      setRegServiceUp(regOk);
      setLoginServiceUp(loginOk);

      if (user) {
        const valResult = await authService.validateToken();
        setTokenValidation(valResult.valid);
      }
    };

    checkServices();
  }, [user]);

  const copyToken = () => {
    const token = authService.getToken();
    if (token) {
      navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const rawToken = authService.getToken();

  return (
    <div className="dashboard-container">
      {/* Top Hero Section */}
      <div className="glass-panel dashboard-hero">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 700, letterSpacing: '-0.5px' }}>
              {user ? `Welcome, ${user.fullName || user.username}` : 'Microservices Authentication'}
            </h1>
            {user && <span className="user-badge">Active Session</span>}
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {user
              ? 'You are securely authenticated using JWT issued by Login Service and persisted in MySQL.'
              : 'Spring Boot Microservices Architecture with React Minimalist Glassmorphic UI.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {user ? (
            <button className="btn-secondary" onClick={onLogout} style={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#fda4af' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Sign Out
            </button>
          ) : (
            <>
              <button className="btn-secondary" onClick={onNavigateToLogin}>
                Sign In
              </button>
              <button className="btn-primary" onClick={onNavigateToRegister} style={{ margin: 0, width: 'auto' }}>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="dashboard-grid">
        {/* Microservices Cluster Health */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
              <line x1="6" y1="6" x2="6.01" y2="6"></line>
              <line x1="6" y1="18" x2="6.01" y2="18"></line>
            </svg>
            Microservices Health
          </div>

          <div className="data-row">
            <span className="data-label">Registration Service (Port 8081)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span
                className="status-dot"
                style={{
                  backgroundColor: regServiceUp ? '#10b981' : '#f43f5e',
                  boxShadow: regServiceUp ? '0 0 8px #10b981' : '0 0 8px #f43f5e'
                }}
              ></span>
              {regServiceUp === null ? 'Checking...' : regServiceUp ? 'Online (200 OK)' : 'Offline / Standby'}
            </span>
          </div>

          <div className="data-row">
            <span className="data-label">Login Service (Port 8082)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <span
                className="status-dot"
                style={{
                  backgroundColor: loginServiceUp ? '#10b981' : '#f43f5e',
                  boxShadow: loginServiceUp ? '0 0 8px #10b981' : '0 0 8px #f43f5e'
                }}
              ></span>
              {loginServiceUp === null ? 'Checking...' : loginServiceUp ? 'Online (200 OK)' : 'Offline / Standby'}
            </span>
          </div>

          <div className="data-row">
            <span className="data-label">Database Target</span>
            <span className="data-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#38bdf8' }}>
              MySQL 8.0 &bull; auth_db
            </span>
          </div>
        </div>

        {/* Database Tables Architecture */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div className="card-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
            Database Schema Design
          </div>

          <div className="data-row">
            <div>
              <div style={{ fontWeight: 600, color: '#f8fafc' }}>usertable</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>id, username, email, password, full_name, created_at</div>
            </div>
            <span className="service-badge badge-registration">Registration</span>
          </div>

          <div className="data-row">
            <div>
              <div style={{ fontWeight: 600, color: '#f8fafc' }}>jwttable</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>id, username, token, issued_at, expires_at, revoked</div>
            </div>
            <span className="service-badge badge-login">Login</span>
          </div>
        </div>

        {/* Active Session / JWT Details */}
        {user ? (
          <div className="glass-panel" style={{ padding: '24px', gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div className="card-title" style={{ margin: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Active JWT Token & Session Inspector
              </div>
              <button className="btn-secondary" onClick={copyToken} style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                {copied ? 'Copied to Clipboard!' : 'Copy Bearer Token'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Authenticated User ID</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#38bdf8' }}>#{user.userId || 'N/A'}</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Username & Email</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>{user.username} &bull; {user.email}</div>
              </div>
              <div style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Token Validation Status</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 600, color: tokenValidation ? '#10b981' : '#f59e0b' }}>
                  {tokenValidation ? 'Verified in jwttable' : 'Verifying with service...'}
                </div>
              </div>
            </div>

            <div className="code-box">
              {rawToken ? `Bearer ${rawToken}` : 'No active token recorded.'}
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: '28px', gridColumn: '1 / -1', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Ready to test the microservices flow?</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 20px', fontSize: '0.92rem' }}>
              Create a new user account through the Registration Service (Port 8081), then sign in with the Login Service (Port 8082) to generate a signed JWT stored into MySQL jwttable.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={onNavigateToRegister} style={{ width: 'auto', padding: '10px 24px' }}>
                Create New User
              </button>
              <button className="btn-secondary" onClick={onNavigateToLogin} style={{ padding: '10px 24px' }}>
                Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
