import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSocket from '../hooks/useSocket';

export default function SessionLobby() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { students, qrCode } = useSocket(code);
  const [sessionCode] = useState(code || 'ABC123');

  const joinedStudents = students || [];
  const studentNames = ['Rahul K.', 'Priya S.', 'Marcus L.', 'Aisha O.', 'Chen W.', 'Elena R.'];

  const handleStartSession = () => {
    navigate(`/dashboard?code=${sessionCode}`);
  };

  return (
    <div style={{
      backgroundColor: 'var(--background)', color: 'var(--on-surface)',
      fontFamily: "'Inter', sans-serif", overflow: 'hidden', minHeight: '100vh',
    }}>
      {/* Atmospheric Mesh Background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60%', height: '60%', borderRadius: '50%', background: 'rgba(128, 131, 255, 0.1)', filter: 'blur(120px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '50%', height: '50%', borderRadius: '50%', background: 'rgba(74, 225, 118, 0.05)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '20%', width: '40%', height: '40%', borderRadius: '50%', background: 'rgba(73, 75, 214, 0.1)', filter: 'blur(110px)' }} />
      </div>

      {/* Main Content */}
      <main style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', minHeight: '100vh', padding: '48px 32px 64px' }}>
        {/* Top: Logo & Session Info */}
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', textAlign: 'center' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-16px', background: 'rgba(128, 131, 255, 0.2)', filter: 'blur(16px)', borderRadius: '50%' }} />
            <h1 className="font-headline" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.03em', position: 'relative' }}>
              Liquid Prism Classroom
            </h1>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <h2 className="font-headline" style={{ color: 'var(--primary)', fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 700, letterSpacing: '-0.01em' }}>Recursion in Python</h2>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)', boxShadow: '0 0 10px #4ae176' }} />
              <p style={{ color: 'var(--on-surface-variant)', fontWeight: 500, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.05em' }}>Waiting for students...</p>
            </div>
          </div>
        </header>

        {/* Center: QR Code Section */}
        <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', width: '100%', maxWidth: '1024px' }}>
          {/* QR Frame */}
          <div style={{ position: 'relative' }}>
            {/* Refractive Border */}
            <div style={{
              position: 'absolute', inset: '-2px',
              background: 'linear-gradient(135deg, rgba(192, 193, 255, 0.3), transparent, rgba(74, 225, 118, 0.3))',
              borderRadius: '40px', opacity: 0.5,
            }} />
            <div className="glass-refraction prism-glow" style={{ padding: '40px', borderRadius: '36px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
              <div style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
                {qrCode ? (
                  <img src={qrCode} alt="QR Code" style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ width: '300px', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f0', borderRadius: '8px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '80px', color: '#999' }}>qr_code_2</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Session Code */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>Enter code manually</p>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              backgroundColor: 'var(--surface-container-high)',
              padding: '16px 32px', borderRadius: '16px', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onClick={() => navigator.clipboard?.writeText(sessionCode)}
            >
              <span className="font-headline" style={{ fontSize: 'clamp(48px, 6vw, 72px)', fontWeight: 800, letterSpacing: '0.2em', paddingLeft: '16px' }}>{sessionCode}</span>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '32px' }}>content_copy</span>
            </div>
          </div>
        </section>

        {/* Bottom: Students & CTA */}
        <footer style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '48px' }}>
          {/* Student Participation */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex' }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: '40px', height: '40px', borderRadius: '50%',
                    backgroundColor: 'var(--surface-container-high)',
                    border: '4px solid var(--surface-container-low)',
                    marginLeft: i > 0 ? '-12px' : 0,
                  }} />
                ))}
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  backgroundColor: 'var(--surface-container-highest)',
                  border: '4px solid var(--surface-container-low)',
                  marginLeft: '-12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 700, color: 'var(--primary)',
                }}>+{Math.max(0, joinedStudents.length - 4) || 8}</div>
              </div>
              <span className="font-headline" style={{ fontWeight: 700, fontSize: '20px' }}>{joinedStudents.length || 12} Students Joined</span>
            </div>

            {/* Student Names Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '24px', width: '100%', maxWidth: '1024px', padding: '0 16px' }}>
              {studentNames.map((name, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <p style={{ color: 'var(--on-surface-variant)', fontWeight: 500, fontSize: '14px' }}>{name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <button onClick={handleStartSession} style={{
            position: 'relative', padding: '20px 48px',
            background: 'linear-gradient(to right, var(--primary), var(--inverse-primary))',
            borderRadius: '16px', overflow: 'hidden', border: 'none', cursor: 'pointer',
            boxShadow: '0 10px 40px rgba(73, 75, 214, 0.3)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '12px',
          }}
          onMouseOver={e => e.currentTarget.style.boxShadow = '0 15px 50px rgba(73, 75, 214, 0.4)'}
          onMouseOut={e => e.currentTarget.style.boxShadow = '0 10px 40px rgba(73, 75, 214, 0.3)'}
          >
            <span className="font-headline" style={{ color: 'var(--on-primary)', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.01em' }}>Start Session</span>
            <span className="material-symbols-outlined" style={{ color: 'var(--on-primary)', fontSize: '24px', fontWeight: 700 }}>arrow_forward</span>
          </button>
        </footer>
      </main>

      {/* Refraction Overlays */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 50 }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: '1px', height: '100%', background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05), transparent)' }} />
      </div>
    </div>
  );
}
