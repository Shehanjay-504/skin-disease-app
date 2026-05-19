import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.login(email, password);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
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
            <h2>Welcome Back</h2>
            <p>Login to your account to continue</p>
          </div>

          {error && <div className="alert alert-error show">{error}</div>}

          <form onSubmit={handleSubmit}>
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
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.75rem', color: 'var(--text2)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--accent)', fontWeight: '700' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

const authPageStyles = `
  .auth-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .auth-page::before {
    content: '';
    position: fixed;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(15, 23, 42, 0.8) 0%,
      rgba(30, 58, 95, 0.6) 50%,
      rgba(59, 130, 246, 0.1) 100%
    );
    z-index: 0;
    pointer-events: none;
  }

  [data-theme="light"] .auth-page::before {
    background: linear-gradient(
      135deg,
      rgba(248, 250, 252, 0.85) 0%,
      rgba(248, 250, 252, 0.75) 50%,
      rgba(59, 130, 246, 0.08) 100%
    );
  }

  .auth-container {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 420px;
    padding: 2rem;
  }

  .auth-card {
    background: var(--surface);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    transition: all var(--transition);
  }

  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .auth-logo {
    font-family: 'Syne', sans-serif;
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 1.25rem;
    color: var(--text);
    letter-spacing: -0.5px;
  }

  .auth-logo span {
    color: var(--accent);
  }

  .auth-header h2 {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .auth-header p {
    color: var(--text2);
    font-size: 0.9rem;
  }

  .auth-card form button {
    width: 100%;
  }

  @media (max-width: 480px) {
    .auth-container {
      padding: 1rem;
    }

    .auth-card {
      padding: 1.75rem;
    }
  }
`;

const style = document.createElement('style');
style.textContent = authPageStyles;
if (!document.head.querySelector(`style[data-auth-page]`)) {
  style.setAttribute('data-auth-page', 'true');
  document.head.appendChild(style);
}
