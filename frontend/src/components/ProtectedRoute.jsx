import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Ambil token dari localStorage
  const token = localStorage.getItem('token'); 
  
  console.log('ProtectedRoute: Checking authentication', { 
    hasToken: !!token,
    currentPath: window.location.pathname 
  });

  // Jika token tidak ada, arahkan kembali ke halaman login
  if (!token) {
    console.warn('No authentication token found, redirecting to login');
    return <Navigate to="/" replace />;
  }

  // Basic token validation (check if it's expired)
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    console.log('Token validation:', {
      exp: tokenData.exp,
      currentTime,
      expired: tokenData.exp && tokenData.exp < currentTime
    });
    
    if (tokenData.exp && tokenData.exp < currentTime) {
      console.warn('Token expired, redirecting to login');
      localStorage.removeItem('token');
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    console.warn('Invalid token format, redirecting to login', error);
    localStorage.removeItem('token');
    return <Navigate to="/" replace />;
  }

  console.log('Authentication passed, rendering protected content');
  // Jika token ada dan valid, izinkan akses ke children (komponen yang dilindungi)
  return children;
};

export default ProtectedRoute;
