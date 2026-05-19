import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      await authService.register(name, email, password);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              Skin<span>Dx</span>
            </div>
            <h2>Create Account</h2>
            <p>Join our platform for AI-powered skin diagnosis</p>
          </div>

          {error && <div className="alert alert-error show">{error}</div>}
          {success && <div className="alert alert-success show">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating account...
                </>
              ) : (
                'Register'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--text2)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
