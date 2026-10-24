import React from 'react';

export default function Navbar({ activePage, setActivePage, user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setActivePage(user ? 'home' : 'login')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
        </div>
        <span>Micro<span style={{ color: '#818cf8' }}>Auth</span></span>
      </div>

      <div className="nav-links">
        <button
          className={`nav-link ${activePage === 'home' ? 'active' : ''}`}
          onClick={() => setActivePage('home')}
        >
          Home
        </button>

        {!user ? (
          <>
            <button
              className={`nav-link ${activePage === 'login' ? 'active' : ''}`}
              onClick={() => setActivePage('login')}
            >
              Sign In
            </button>
            <button
              className={`nav-link ${activePage === 'register' ? 'active' : ''}`}
              onClick={() => setActivePage('register')}
            >
              Create Account
            </button>
          </>
        ) : (
          <div className="nav-user">
            <span className="user-badge">@{user.username}</span>
            <button className="btn-secondary" onClick={onLogout}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
