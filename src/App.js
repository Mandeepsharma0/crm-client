import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import Login from './components/Auth/Login';
import Home from './pages/Home';
import AIButton from './components/AI/AIButton';
import AIDialog from './components/AI/AIDialog';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAI, setShowAI] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking authentication status...');
        const response = await fetch(
          'https://crm-server-qfv6.onrender.com/api/auth/status',
          {
            credentials: 'include' // ✅ send cookies (connect.sid)
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch auth status');
        }

        const data = await response.json();
        console.log('Authentication status:', data);

        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setLoading(false); // ✅ always unset loading
      }
    };

    checkAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      console.log('Initiating logout...');
      const response = await fetch(
        'https://crm-server-qfv6.onrender.com/api/auth/logout',
        {
          method: 'POST',
          credentials: 'include' // ✅ include cookie for session logout
        }
      );

      if (response.ok) {
        console.log('Logout successful');
        setIsAuthenticated(false);
      } else {
        console.error('Logout failed:', await response.text());
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/login"
            element={<Login onLogin={() => setIsAuthenticated(true)} />}
          />
          <Route
            path="/home/*"
            element={
              isAuthenticated ? (
                <Home onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? '/home' : '/login'} />
            }
          />
        </Routes>

        {/* AI button on screen */}
        <AIButton onClick={() => setShowAI(true)} />

        {/* AI bot dialog */}
        <AIDialog open={showAI} onClose={() => setShowAI(false)} />
      </div>
    </Router>
  );
};

export default App;
