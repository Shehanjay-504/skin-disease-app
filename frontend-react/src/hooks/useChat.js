import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the SkinDx Assistant.. I can help you understand your diagnosis, guide you through uploading a photo, or answer skin health questions. How can I help?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (userText, diagnosisContext = null) => {
    const userMessage = { role: 'user', content: userText };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('skindx_token');
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: updated,
          diagnosisContext,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm the SkinDx Assistant.. How can I help you today?",
    }]);
  }, []);

  return { messages, loading, error, sendMessage, clearChat };
};