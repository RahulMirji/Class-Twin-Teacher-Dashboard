import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const studentInsights = [
  { name: 'Alex Rivers', score: '94%', trend: 'trending_up', scoreColor: 'var(--secondary)', scoreBg: 'rgba(74, 225, 118, 0.1)', scoreBorder: 'rgba(74, 225, 118, 0.2)' },
  { name: 'Casey Jenkins', score: '88%', trend: 'trending_flat', scoreColor: 'var(--primary)', scoreBg: 'rgba(192, 193, 255, 0.1)', scoreBorder: 'rgba(192, 193, 255, 0.2)' },
  { name: 'Jordan Smith', score: '72%', trend: 'trending_down', scoreColor: 'var(--tertiary)', scoreBg: 'rgba(202, 129, 0, 0.1)', scoreBorder: 'rgba(255, 185, 95, 0.2)', trendColor: 'var(--error)' },
  { name: 'Sam Taylor', score: '91%', trend: 'trending_up', scoreColor: 'var(--secondary)', scoreBg: 'rgba(74, 225, 118, 0.1)', scoreBorder: 'rgba(74, 225, 118, 0.2)' },
];

const actionItems = [
  { priority: 'Priority 1', label: 'Visualizing Factorial Tree Diagrams', color: 'var(--primary)' },
  { priority: 'Priority 2', label: 'Identify Base Cases in Fibonacci', color: 'var(--on-surface-variant)' },
  { priority: 'Priority 3', label: 'Heap vs Stack allocation review', color: 'var(--on-surface-variant)' },
];

export default function PostSessionAnalytics() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar />
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto', backgroundColor: '#101419', color: '#e0e2ea', fontFamily: "'Inter', sans-serif", backgroundImage: 'radial-gradient(circle at top right, rgba(128, 131, 255, 0.15), transparent 50%)', paddingBottom: '96px' }}>
      {/* Top NavBar */}
      <header style={{
        backgroundColor: 'rgba(24, 28, 33, 0.8)',
        backdropFilter: 'blur(30px)',
        position: 'sticky', top: 0, zIndex: 50,
        borderBottom: '1px solid rgba(224, 226, 234, 0.15)',
        boxShadow: '0 40px 40px rgba(224, 226, 234, 0.04)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 32px', height: '80px',
      }}>
        <div className="font-headline" style={{ fontSize: '24px', fontWeight: 700, background: 'linear-gradient(to right, #c0c1ff, #494bd6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClassTwin</div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/sessions'); }} style={{ color: 'rgba(224, 226, 234, 0.6)', transition: 'color 0.3s', fontSize: '14px' }}>Sessions</a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/sessions'); }} style={{ color: 'rgba(224, 226, 234, 0.6)', transition: 'color 0.3s', fontSize: '14px' }}>Library</a>
          <a href="#" style={{ color: '#c0c1ff', borderBottom: '2px solid #c0c1ff', paddingBottom: '4px', fontSize: '14px' }}>Analytics</a>
          <a href="#" style={{ color: 'rgba(224, 226, 234, 0.6)', transition: 'color 0.3s', fontSize: '14px' }}>Settings</a>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0c1ff' }}>
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#c0c1ff' }}>
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            border: '1px solid rgba(192, 193, 255, 0.2)',
            backgroundColor: 'var(--surface-container-high)',
            overflow: 'hidden',
          }} />
        </div>
      </header>

      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: '64px' }}>
        {/* Hero Section */}
        <section style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', marginBottom: '32px' }}>
            <div>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--secondary)', fontWeight: 600, marginBottom: '8px' }}>Post-Session Report</p>
              <h1 className="font-headline" style={{ fontSize: '48px', fontWeight: 800, letterSpacing: '-0.03em' }}>Session Summary: Intro to Recursion</h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--on-surface-variant)', marginBottom: '4px' }}>Overall Comprehension</p>
              <div className="font-headline" style={{ fontSize: '80px', fontWeight: 800, color: 'var(--primary)', filter: 'drop-shadow(0 0 30px rgba(128,131,255,0.4))' }}>82%</div>
            </div>
          </div>

          {/* Chart Canvas */}
          <div style={{
            backgroundColor: 'var(--surface-container-low)', borderRadius: '32px',
            padding: '32px', position: 'relative', overflow: 'hidden', height: '400px',
          }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at center, var(--primary), transparent)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                <h3 style={{ color: 'var(--on-surface-variant)', fontWeight: 500 }}>Comprehension Trend (45 min session)</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--primary)' }} />
                    Live Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--secondary)' }} />
                    Class Target
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', flexGrow: 1 }}>
                <svg width="100%" height="100%" viewBox="0 0 1000 200" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c0c1ff" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#494bd6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,90 T1000,40 L1000,200 L0,200 Z" fill="url(#chartGrad)" />
                  <path d="M0,180 Q100,160 200,100 T400,120 T600,60 T800,90 T1000,40" fill="none" stroke="#c0c1ff" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="200" cy="100" r="6" fill="#101419" stroke="#c0c1ff" strokeWidth="2" />
                  <circle cx="600" cy="60" r="6" fill="#101419" stroke="#c0c1ff" strokeWidth="2" />
                  <circle cx="1000" cy="40" r="6" fill="#101419" stroke="#c0c1ff" strokeWidth="2" />
                </svg>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'rgba(199, 196, 215, 0.4)', fontFamily: 'monospace', paddingTop: '16px' }}>
                  <span>00:00</span><span>15:00</span><span>30:00</span><span>45:00 (END)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <section style={{ display: 'grid', gridTemplateColumns: '4fr 5fr 3fr', gap: '24px' }}>
          {/* AI Summary */}
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', borderTop: '2px solid rgba(74, 225, 118, 0.2)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-48px', right: '-48px', width: '128px', height: '128px', background: 'rgba(74, 225, 118, 0.05)', filter: 'blur(40px)', borderRadius: '50%' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--secondary)' }}>psychology</span>
              <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: 700 }}>AI Summary</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', color: 'var(--on-surface-variant)', lineHeight: 1.6 }}>
              <p>The class demonstrated high initial engagement, but encountered a significant "refractive friction" point at the 22-minute mark.</p>
              <div style={{ padding: '16px', backgroundColor: 'rgba(49, 53, 59, 0.4)', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--secondary)' }}>Key Struggle Points:</p>
                <ul style={{ fontSize: '14px', paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li>Base case logic vs Infinite loops</li>
                  <li>Visualizing the call stack</li>
                  <li>Tail recursion optimization</li>
                </ul>
              </div>
              <p style={{ fontSize: '14px', fontStyle: 'italic', opacity: 0.7 }}>"65% of students paused during the Factorial code-along to re-read the terminal state condition."</p>
            </div>
          </div>

          {/* Student Insights */}
          <div className="glass-panel" style={{ borderRadius: '24px', padding: '32px', border: '1px solid rgba(70, 69, 84, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>groups</span>
                <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: 700 }}>Student Insights</h2>
              </div>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--on-surface-variant)' }}>N=28 Students</span>
            </div>
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', padding: '0 16px 16px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(199, 196, 215, 0.5)' }}>
              <div>Student Name</div>
              <div style={{ textAlign: 'center' }}>Score</div>
              <div style={{ textAlign: 'right' }}>Trend</div>
            </div>
            {/* Table Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {studentInsights.map((s, i) => (
                <div key={i} style={{
                  display: 'grid', gridTemplateColumns: '3fr 2fr 1fr', alignItems: 'center',
                  padding: '16px', borderRadius: '12px',
                  transition: 'background 0.3s', cursor: 'default',
                }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--surface-container-high)'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <span style={{
                      backgroundColor: s.scoreBg, color: s.scoreColor,
                      fontSize: '12px', padding: '4px 8px', borderRadius: '999px',
                      border: `1px solid ${s.scoreBorder}`,
                    }}>{s.score}</span>
                  </div>
                  <div style={{ textAlign: 'right', color: s.trendColor || s.scoreColor }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{s.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div style={{ backgroundColor: 'var(--surface-container-high)', borderRadius: '24px', padding: '32px', border: '1px solid rgba(192, 193, 255, 0.1)', boxShadow: '0 25px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>assignment_turned_in</span>
              <h2 className="font-headline" style={{ fontSize: '20px', fontWeight: 700, color: 'var(--primary-fixed-dim)' }}>Action Items</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {actionItems.map((item, i) => (
                <div key={i} style={{
                  padding: '16px', backgroundColor: 'var(--surface-container-lowest)', borderRadius: '16px',
                  border: '1px solid rgba(70, 69, 84, 0.05)', cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(192, 193, 255, 0.3)'}
                onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(70, 69, 84, 0.05)'}
                >
                  <div style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: item.color, marginBottom: '4px' }}>{item.priority}</div>
                  <p style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.3 }}>{item.label}</p>
                </div>
              ))}
              <button style={{
                width: '100%', marginTop: '16px', padding: '12px',
                backgroundColor: 'rgba(128, 131, 255, 0.2)',
                color: 'var(--primary-fixed-dim)',
                border: '1px solid rgba(192, 193, 255, 0.2)',
                borderRadius: '12px', fontWeight: 600,
                fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em',
                cursor: 'pointer', transition: 'all 0.2s',
              }}>Schedule Next Lab</button>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Action Buttons */}
      <div style={{ position: 'fixed', bottom: '48px', right: '48px', display: 'flex', gap: '16px', zIndex: 40 }}>
        <button className="glass-panel" style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 24px', border: '1px solid rgba(70, 69, 84, 0.2)',
          borderRadius: '16px', fontWeight: 600, cursor: 'pointer',
          boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          transition: 'all 0.2s', color: 'var(--on-surface)',
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>picture_as_pdf</span>
          Export PDF
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '16px 24px',
          background: 'linear-gradient(to bottom right, var(--primary), var(--inverse-primary))',
          border: '1px solid rgba(128, 131, 255, 0.5)',
          borderRadius: '16px', fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 0 20px rgba(128, 131, 255, 0.3)',
          transition: 'all 0.2s', color: 'var(--on-primary)',
        }}>
          <span className="material-symbols-outlined">share</span>
          Share with LMS
        </button>
      </div>
      </div>
    </div>
  );
}
