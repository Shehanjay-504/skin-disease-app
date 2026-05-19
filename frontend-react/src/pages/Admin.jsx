import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';

export const Admin = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers(),
      ]);
      setStats(statsData.stats);
      setUsers(usersData.users || []);
    } catch (err) {
      setError(err.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await adminService.deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      setError(err.message || 'Failed to delete user');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '1000px', paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '2rem', fontSize: '2rem', fontWeight: '800', fontFamily: '"Syne", sans-serif' }}>Admin Dashboard</h1>

      {error && <div className="alert alert-error show">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
          <span className="spinner"></span>
          <p style={{ marginTop: '1rem' }}>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem' }}>
            <button
              className={`btn ${activeTab === 'stats' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('stats')}
            >
              Statistics
            </button>
            <button
              className={`btn ${activeTab === 'users' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
          </div>

          {activeTab === 'stats' && stats && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
              <div className="card">
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
                  Total Users
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', fontFamily: '"Syne", sans-serif' }}>
                  {stats.total_users || 0}
                </div>
              </div>
              <div className="card">
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
                  Total Predictions
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', fontFamily: '"Syne", sans-serif' }}>
                  {stats.total_predictions || 0}
                </div>
              </div>
              <div className="card">
                <div style={{ color: 'var(--text2)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: '600' }}>
                  Active Users
                </div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)', fontFamily: '"Syne", sans-serif' }}>
                  {stats.active_users || 0}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              {users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)' }}>
                  No users found
                </div>
              ) : (
                <div style={{ overflowX: 'auto', background: 'var(--surface)', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface2)' }}>
                        <th style={{ textAlign: 'left', padding: '1.25rem', color: 'var(--text2)', fontWeight: '700', fontSize: '0.9rem' }}>Name</th>
                        <th style={{ textAlign: 'left', padding: '1.25rem', color: 'var(--text2)', fontWeight: '700', fontSize: '0.9rem' }}>Email</th>
                        <th style={{ textAlign: 'left', padding: '1.25rem', color: 'var(--text2)', fontWeight: '700', fontSize: '0.9rem' }}>Role</th>
                        <th style={{ textAlign: 'left', padding: '1.25rem', color: 'var(--text2)', fontWeight: '700', fontSize: '0.9rem' }}>Joined</th>
                        <th style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text2)', fontWeight: '700', fontSize: '0.9rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background-color var(--transition)' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface2)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                          <td style={{ padding: '1.25rem', color: 'var(--text)' }}>{user.name}</td>
                          <td style={{ padding: '1.25rem', color: 'var(--text2)' }}>{user.email}</td>
                          <td style={{ padding: '1.25rem' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '0.35rem 0.85rem',
                                background: user.role === 'admin' ? 'var(--warning)' : 'var(--accent)',
                                color: 'white',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                              }}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td style={{ padding: '1.25rem', color: 'var(--text2)' }}>
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1.25rem', textAlign: 'center' }}>
                            <button
                              className="btn btn-danger"
                              onClick={() => handleDeleteUser(user.id)}
                              style={{ padding: '0.5rem 0.95rem', fontSize: '0.85rem' }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
