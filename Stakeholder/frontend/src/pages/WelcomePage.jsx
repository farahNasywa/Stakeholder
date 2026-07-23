import React from 'react';
import { Link } from 'react-router-dom';
import './WelcomePage.css';

const WelcomePage = () => {
  return (
    <div className="handshake-page" style={{ backgroundImage: 'url("/images/bg-stakeholder2.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="overlay1">
        <div className="content">
          <h1>Welcome!</h1>
          <p>You are now part of the stakeholder.</p>
          <Link to="/dashboard" className="continue-btn">
            Continue to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
