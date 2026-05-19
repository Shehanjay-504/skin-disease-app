import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { isLoggedIn } = useAuth();

  return (
    <div className="home-page" style={{
      minHeight: '100vh',
      padding: '0 0 4rem 0',   
    }}>
      <div className="container">
        <div className="hero">
          <div className="hero-badge">AI-Powered Diagnosis</div>
          <h1 className="hero-title" style={{ color: '#f1f5f9', textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            Detect Skin<br />
            <span className="accent" style={{ color: '#60a5fa' }}>Conditions</span>
            <br />
            Instantly
          </h1>
          <p className="hero-sub" style={{ color: '#cbd5e1', textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            Upload a photo of your skin concern and our CNN model will analyze
            and classify it within seconds. Fast, accurate, and secure.
          </p>
          <div className="hero-actions">
            {isLoggedIn ? (
              <Link to="/upload" className="btn btn-primary">Start Diagnosis</Link>
            ) : (
              <Link to="/login" className="btn btn-primary">Get Started</Link>
            )}
            <Link to="/upload" className="btn btn-ghost">Learn More</Link>
          </div>

          <div className="hero-stats" style={{
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '16px',
            padding: '1.25rem 2rem',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            marginTop: '2.5rem',
          }}>
            <div className="stat">
              <span className="stat-num" style={{ color: '#60a5fa' }}>8+</span>
              <span className="stat-label" style={{ color: '#e2e8f0' }}>Conditions Detected</span>
            </div>
            <div className="stat">
              <span className="stat-num" style={{ color: '#60a5fa' }}>CNN</span>
              <span className="stat-label" style={{ color: '#e2e8f0' }}>Transfer Learning</span>
            </div>
            <div className="stat">
              <span className="stat-num" style={{ color: '#60a5fa' }}>JWT</span>
              <span className="stat-label" style={{ color: '#e2e8f0' }}>Secure & Private</span>
            </div>
          </div>
        </div>

        <div className="features-grid" style={{ marginTop: '4rem' }}>
          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-icons">biotech</span>
            </div>
            <h3>AI Diagnosis</h3>
            <p>CNN model trained on thousands of dermatology images with transfer learning for high accuracy.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-icons">lock</span>
            </div>
            <h3>Secure & Private</h3>
            <p>JWT authentication with role-based access control. Your images are protected.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <span className="material-icons">history</span>
            </div>
            <h3>Full History</h3>
            <p>Track all your diagnoses over time with confidence scores and timestamps.</p>
          </div>
        </div>
      </div>
    </div>
  );
};