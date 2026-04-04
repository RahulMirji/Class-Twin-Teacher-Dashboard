import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';

export default function StartSessionModal({ onClose }) {
  const [topic, setTopic] = useState('');
  const [totalRounds, setTotalRounds] = useState(8);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createSession } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createSession({ topic: topic || 'General', totalRounds });
      if (result?.code) {
        navigate(`/lobby/${result.code}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="glass-panel" style={{
        width: '100%', maxWidth: '480px',
        borderRadius: '32px', padding: '40px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.5)',
      }}>
        <h2 className="font-headline" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Start New Session</h2>
        <p style={{ color: 'var(--on-surface-variant)', marginBottom: '32px', fontSize: '14px' }}>
          Create a live classroom session. Students will join via QR code.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>
              Topic / Subject
            </label>
            <input
              type="text"
              placeholder="e.g., Recursion in Python"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              autoFocus
              style={{
                width: '100%', padding: '14px 16px',
                backgroundColor: 'var(--surface-container-lowest)',
                border: '1px solid rgba(70, 69, 84, 0.3)',
                borderRadius: '12px', color: 'var(--on-surface)',
                fontSize: '14px', outline: 'none',
              }}
            />
          </div>

          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)' }}>
              Number of Rounds
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[4, 6, 8, 10].map(n => (
                <button
                  key={n}
                  type="button"
                  style={{
                    flex: 1, padding: '12px',
                    borderRadius: '12px', border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: '14px',
                    transition: 'all 0.2s',
                    ...(totalRounds === n ? {
                      background: 'linear-gradient(to right, var(--primary), var(--inverse-primary))',
                      color: 'var(--on-primary-fixed)',
                      boxShadow: '0 4px 12px rgba(192, 193, 255, 0.3)',
                    } : {
                      backgroundColor: 'var(--surface-container-high)',
                      color: 'var(--on-surface)',
                    }),
                  }}
                  onClick={() => setTotalRounds(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '14px',
              backgroundColor: 'var(--surface-container-highest)', color: 'var(--on-surface)',
              borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: '14px',
            }}>Cancel</button>
            <button type="submit" disabled={loading} style={{
              flex: 2, padding: '14px',
              background: 'linear-gradient(to right, var(--primary), var(--inverse-primary))',
              color: 'var(--on-primary-fixed)',
              borderRadius: '12px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: '14px',
              boxShadow: '0 8px 20px rgba(192, 193, 255, 0.3)',
              opacity: loading ? 0.6 : 1,
            }}>
              {loading ? '⏳ Creating...' : '🚀 Create Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
