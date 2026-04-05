import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';

export default function StartSessionModal({ onClose }) {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createSession } = useSocket();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const result = await createSession({ topic: topic.trim(), totalRounds: 8 });
      if (result?.code) navigate(`/lobby/${result.code}?sessionId=${result.id}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, zIndex: 100,
      backgroundColor: 'rgba(17, 24, 39, 0.4)',
      backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxWidth: '460px',
        background: '#FFFFFF',
        borderRadius: '24px', padding: '32px',
        border: '1px solid #EAECF0',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle green corner glow */}
        <div style={{
          position: 'absolute', top: '-40px', right: '-40px',
          width: '160px', height: '160px', borderRadius: '50%',
          background: 'rgba(26, 92, 59, 0.06)', pointerEvents: 'none',
        }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '12px',
            background: '#E8F5EE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined filled" style={{ color: '#1A5C3B', fontSize: '22px' }}>videocam</span>
          </div>
          <div>
            <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>Start Live Class</h2>
            <p style={{ color: '#9CA3AF', fontSize: '12px' }}>Your video goes live instantly</p>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', width: '32px', height: '32px', borderRadius: '50%', background: '#F9FAFB', border: '1px solid #EAECF0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6B7280' }}>close</span>
          </button>
        </div>

        <div style={{ height: '1px', background: '#F3F4F6', margin: '20px 0' }} />

        <form onSubmit={handleSubmit}>
          {/* Topic */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 600, color: '#374151' }}>
              Topic / Subject *
            </label>
            <input
              type="text"
              placeholder="e.g., Recursion in Python, Photosynthesis, World War II..."
              value={topic}
              onChange={e => setTopic(e.target.value)}
              autoFocus
              required
              style={{
                width: '100%', padding: '12px 14px',
                background: '#F9FAFB',
                border: '1px solid #EAECF0',
                borderRadius: '12px', color: '#111827',
                fontSize: '14px', outline: 'none',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                boxSizing: 'border-box', fontFamily: 'Inter, sans-serif',
              }}
              onFocus={e => { e.target.style.borderColor = '#1A5C3B'; e.target.style.boxShadow = '0 0 0 3px rgba(26,92,59,0.08)'; }}
              onBlur={e => { e.target.style.borderColor = '#EAECF0'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {/* Info badges */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { icon: 'qr_code_2', label: 'QR code generated' },
              { icon: 'notifications', label: 'Students notified' },
              { icon: 'psychology', label: 'AI insights active' },
            ].map(({ icon, label }) => (
              <div key={label} style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '5px 10px', borderRadius: '8px',
                background: '#E8F5EE', border: '1px solid rgba(26, 92, 59, 0.12)',
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#1A5C3B' }}>{icon}</span>
                <span style={{ fontSize: '11px', color: '#1A5C3B', fontWeight: 600 }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" onClick={onClose} className="ct-btn-outline" style={{ flex: 1, justifyContent: 'center', borderRadius: '12px', padding: '12px' }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="ct-btn-primary"
              style={{
                flex: 2, justifyContent: 'center', borderRadius: '12px', padding: '12px',
                opacity: (!topic.trim() && !loading) ? 0.5 : 1,
                cursor: loading || !topic.trim() ? 'not-allowed' : 'pointer',
                background: loading ? '#9CA3AF' : undefined,
                boxShadow: loading ? 'none' : undefined,
              }}
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px', animation: 'spin 1s linear infinite' }}>progress_activity</span>
                  Creating Room...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>videocam</span>
                  Go Live
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
