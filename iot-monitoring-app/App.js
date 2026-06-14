import React, { useState } from 'react';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState('');

  const handleLogin = (userName) => {
    setName(userName);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setName('');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <DashboardScreen username={name} onLogout={handleLogout} />;
}