import React, { useState } from 'react';

import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [authScreen, setAuthScreen] = useState('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  const handleLogin = (userName) => {
    setName(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setName('');
    setIsLoggedIn(false);
    setAuthScreen('login');
  };

  const handleGoToSignUp = () => {
    setAuthScreen('signup');
  };

  const handleGoToLogin = () => {
    setAuthScreen('login');
  };

  if (isLoggedIn) {
    return <DashboardScreen username={name} onLogout={handleLogout} />;
  }

  if (authScreen === 'signup') {
    return <SignUpScreen onGoToLogin={handleGoToLogin} />;
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onGoToSignUp={handleGoToSignUp}
    />
  );
}