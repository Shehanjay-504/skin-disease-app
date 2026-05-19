import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../contexts/AuthContext';

export const ChatBot = ({ diagnosisContext = null }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, loading, error, sendMessage, clearChat } = useChat();
  const { isLoggedIn } = useAuth();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    await sendMessage(text, diagnosisContext);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    'What does my diagnosis mean?',
    'How do I upload a photo?',
    'Is this condition serious?',
  ];

  if (!isLoggedIn) return null; // only show for logged-in users

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--accent)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          zIndex: 1000,
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
          transform: isOpen ? 'scale(0.9)' : 'scale(1)',
        }}
        aria-label="Open chat assistant"
      >
        <span className="material-icons" style={{ color: 'white', fontSize: '28px' }}>
          {isOpen ? 'close' : 'smart_toy'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '2rem',
          width: '380px',
          height: '520px',     
          maxHeight: 'calc(100vh - 7rem)',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 999,
          overflow: 'hidden',
          animation: 'chatSlideUp 0.3s ease-out',
        }}>

          {/* Header */}
          <div style={{
            padding: '1rem 1.25rem',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}>
            <span className="material-icons" style={{ color: 'white' }}>smart_toy</span>
            <div>
              <p style={{ color: 'white', fontWeight: 700, margin: 0, fontSize: '0.95rem' }}>
                SkinDx Assistant
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: 0, fontSize: '0.75rem' }}>
                AI-powered skin health support
              </p>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                marginLeft: 'auto',
                background: 'rgba(255,255,255,0.15)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                padding: '4px 8px',
                fontSize: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span className="material-icons" style={{ fontSize: '14px' }}>refresh</span>
              Clear
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '0.65rem 1rem',
                  borderRadius: msg.role === 'user'
                    ? '18px 18px 4px 18px'
                    : '18px 18px 18px 4px',
                  background: msg.role === 'user'
                    ? 'var(--accent)'
                    : 'var(--surface2)',
                  color: msg.role === 'user' ? 'white' : 'var(--text)',
                  fontSize: '0.875rem',
                  lineHeight: '1.5',
                  border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
                  whiteSpace: 'pre-wrap',
                }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '0.65rem 1rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '7px', height: '7px',
                      borderRadius: '50%',
                      background: 'var(--accent)',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p style={{ color: 'var(--danger)', fontSize: '0.8rem', textAlign: 'center' }}>
                {error}
              </p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions — show only at start */}
          {messages.length === 1 && (
            <div style={{ padding: '0 1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {quickQuestions.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q, diagnosisContext)}
                  style={{
                    background: 'var(--accent-glow)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    color: 'var(--accent)',
                    fontSize: '0.75rem',
                    padding: '0.4rem 0.85rem',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-body)',
                    transition: 'all 0.2s',
                  }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '0.75rem 1rem',
            borderTop: '1px solid var(--border)',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'flex-end',
          }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your skin health..."
              rows={1}
              style={{
                flex: 1,
                background: 'var(--surface2)',
                border: '1.5px solid var(--border)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem',
                color: 'var(--text)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                resize: 'none',
                outline: 'none',
                lineHeight: '1.5',
                maxHeight: '100px',
                overflowY: 'auto',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: input.trim() && !loading ? 'var(--accent)' : 'var(--surface2)',
                border: '1.5px solid var(--border)',
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              <span className="material-icons" style={{
                fontSize: '20px',
                color: input.trim() && !loading ? 'white' : 'var(--text3)',
              }}>send</span>
            </button>
          </div>
        </div>
      )}

      {/* Animations */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};