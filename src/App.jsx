import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import { authService } from './services/authService';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [currentUser, setCurrentUser] = useState(null);
  const [prefilledUsername, setPrefilledUsername] = useState('');

  // Initialize authentication state on load
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user && authService.isAuthenticated()) {
      setCurrentUser(user);
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setActivePage('home');
  };

  const handleRegisterSuccess = (registeredUsername) => {
    setPrefilledUsername(registeredUsername);
    // Smooth navigation to login page with prefilled username
    setTimeout(() => {
      setActivePage('login');
    }, 1200);
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
    setActivePage('login');
  };

  return (
    <div className="app-container">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        user={currentUser}
        onLogout={handleLogout}
      />

      <main className="main-content">
        {activePage === 'register' && (
          <RegisterPage
            onNavigateToLogin={() => setActivePage('login')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {activePage === 'login' && (
          <LoginPage
            onNavigateToRegister={() => setActivePage('register')}
            onLoginSuccess={handleLoginSuccess}
            initialUsername={prefilledUsername}
          />
        )}

        {activePage === 'home' && (
          <HomePage
            user={currentUser}
            onNavigateToLogin={() => setActivePage('login')}
            onNavigateToRegister={() => setActivePage('register')}
            onLogout={handleLogout}
          />
        )}
      </main>
    </div>
  );
}
