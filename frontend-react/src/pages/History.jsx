import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { predictService } from '../services/api';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await predictService.getHistory();
      setHistory(data.history || []);
    } catch (err) {
      setError(err.message || 'Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      <h1 style={{ marginBottom: '0.75rem', fontSize: '2rem', fontWeight: '800', fontFamily: '"Syne", sans-serif' }}>Diagnosis History</h1>
      <p style={{ color: 'var(--text2)', marginBottom: '2.5rem', fontSize: '1rem' }}>
        View all your previous diagnoses and results
      </p>

      {error && <div className="alert alert-error show">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text2)' }}>
          <span className="spinner"></span>
          <p style={{ marginTop: '1rem' }}>Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            background: 'var(--surface)',
            borderRadius: '16px',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
          }}
        >
          <span
            className="material-icons"
            style={{
              fontSize: '3.5rem',
              color: 'var(--accent)',
              display: 'block',
              marginBottom: '1rem',
            }}
          >
            history
          </span>
          <p style={{ color: 'var(--text2)', marginBottom: '1.75rem', fontSize: '1rem' }}>
            No diagnoses yet. Start by uploading your first image.
          </p>
          <Link to="/upload" className="btn btn-primary">
            Upload Image
          </Link>
        </div>
      ) : (
        <div>
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

                {/* Icon */}
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: 'var(--accent-glow)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span className="material-icons" style={{ color: 'var(--accent)', fontSize: '22px' }}>
                    biotech
                  </span>
                </div>

                {/* Text */}
                <div>
                  <div className="history-disease">{item.predicted_disease}</div>
                  <div className="history-meta">
                    {new Date(item.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>

              {/* Confidence badge */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
                <div className="history-confidence">
                  {(item.confidence * 100).toFixed(1)}%
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>confidence</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
