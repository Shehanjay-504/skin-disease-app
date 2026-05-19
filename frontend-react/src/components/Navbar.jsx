import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export const Navbar = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
    navigate('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-logo">
          <Link to="/">
            Skin<span>Dx</span>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          {currentUser && (
            <>
              <Link to="/upload" className="nav-link">Diagnose</Link>
              <Link to="/history" className="nav-link">History</Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="nav-link admin-link">
              <span className="material-icons nav-icon">settings</span>
              Admin
            </Link>
          )}
          <button
            className="nav-link theme-toggle"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            <span className="material-icons nav-icon">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          {!currentUser ? (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-register">Register</Link>
            </>
          ) : (
            <>
              <span className="nav-user">
                <span className="material-icons nav-icon">account_circle</span>
                {currentUser.name}
              </span>
              <button 
                className="nav-link nav-logout"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {showLogoutModal && (
        <div className="logout-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <span className="material-icons">logout</span>
            </div>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div className="modal-buttons">
              <button 
                className="modal-btn modal-btn-cancel"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="modal-btn modal-btn-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const navbarStyles = `
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    height: 64px;
    background: rgba(15, 23, 42, 0.92);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    font-family: 'DM Sans', sans-serif;
    transition: all var(--transition);
  }

  [data-theme="light"] .navbar {
    background: rgba(248, 250, 252, 0.95);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .nav-logo a {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--text);
    text-decoration: none;
    letter-spacing: -0.5px;
    transition: color var(--transition);
  }

  .nav-logo a:hover {
    color: var(--accent);
  }

  .nav-logo span {
    color: var(--accent);
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.95rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--text2);
    font-size: 0.9rem;
    font-weight: 500;
    transition: all var(--transition);
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.35rem;
    letter-spacing: 0.2px;
  }

  .nav-link:hover {
    color: var(--text);
    background: var(--accent-glow);
  }

  .nav-icon {
    font-size: 1.1rem !important;
  }

  .theme-toggle {
    color: var(--text2) !important;
  }

  .theme-toggle:hover {
    color: var(--accent) !important;
    background: var(--accent-glow);
  }

  .admin-link {
    color: var(--warning) !important;
  }

  .admin-link:hover {
    background: rgba(245, 158, 11, 0.12) !important;
    color: var(--warning) !important;
  }

  .nav-logout {
    color: var(--danger) !important;
  }

  .nav-logout:hover {
    background: rgba(239, 68, 68, 0.12) !important;
    color: var(--danger) !important;
  }

  .nav-register {
    background: var(--accent);
    color: white !important;
    font-weight: 700 !important;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .nav-register:hover {
    background: var(--accent2) !important;
    color: white !important;
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    transform: translateY(-2px);
  }

  .nav-user {
    font-size: 0.85rem;
    color: var(--text2);
    padding: 0 0.75rem;
    border-right: 1px solid var(--border);
    margin-right: 0.5rem;
    display: flex;
    align-items: center;
    gap: 0.35rem;
  }

  body {
    padding-top: 64px !important;
  }

  .logout-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .logout-modal {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 2.5rem;
    width: 100%;
    max-width: 360px;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: var(--accent);
    display: flex;
    justify-content: center;
  }

  .modal-icon .material-icons {
    font-size: 2.5rem !important;
  }

  .logout-modal h3 {
    font-family: 'Syne', sans-serif;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .logout-modal p {
    color: var(--text2);
    font-size: 0.9rem;
    margin-bottom: 1.75rem;
  }

  .modal-buttons {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }

  .modal-btn {
    padding: 0.7rem 1.5rem;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    border: none;
    font-family: 'DM Sans', sans-serif;
    transition: all var(--transition);
    letter-spacing: 0.3px;
  }

  .modal-btn-cancel {
    background: transparent;
    color: var(--text2);
    border: 1.5px solid var(--border);
  }

  .modal-btn-cancel:hover {
    border-color: var(--text);
    color: var(--text);
    background: var(--surface2);
  }

  .modal-btn-logout {
    background: var(--danger);
    color: white;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  .modal-btn-logout:hover {
    background: #dc2626;
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .navbar {
      padding: 0 1rem;
    }

    .nav-links {
      gap: 0.25rem;
    }

    .nav-link {
      padding: 0.4rem 0.6rem;
      font-size: 0.85rem;
    }

    .nav-user {
      display: none;
    }

    .logout-modal {
      padding: 2rem;
      max-width: 320px;
    }
  }
`;

// Inject styles
const style = document.createElement('style');
style.textContent = navbarStyles;
document.head.appendChild(style);
