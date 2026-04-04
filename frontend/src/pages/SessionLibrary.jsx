import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StartSessionModal from '../components/StartSessionModal';

const sessionCards = [
  {
    icon: 'javascript', title: 'Intro to JS', status: 'Completed', statusColor: 'var(--secondary)',
    desc: 'Foundational syntax and asynchronous logic for sophomore engineering cohorts.',
    heatmapBars: [40, 60, 85, 30, 70, 95, 45, 80, 55, 35],
    heatmapLabel: 'Student Engagement Heatmap',
    footer: 'Last taught Oct 12',
  },
  {
    icon: 'css', title: 'Advanced CSS', status: 'Draft', statusColor: 'var(--primary)',
    desc: 'Mastering Grid, Subgrid, and container queries for adaptive design systems.',
    heatmapBars: null,
    heatmapLabel: null,
    footer: 'Created 2 days ago',
  },
  {
    icon: 'cycle', title: 'React Hooks', status: 'Highly Rated', statusColor: 'var(--secondary)',
    desc: 'Deep dive into state management, effect cycles, and custom hook architecture.',
    heatmapBars: [90, 95, 88, 92, 98, 85, 80, 90, 94, 82],
    heatmapLabel: 'Peak Retention Profile',
    footer: 'Last taught Nov 02',
    rating: '4.9 Impact Score',
    highlighted: true,
  },
];

export default function SessionLibrary() {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar onStartSession={() => setShowModal(true)} />
      
      <main style={{ flex: 1, height: '100vh', overflowY: 'auto', position: 'relative', backgroundColor: 'var(--background)' }}>
        {/* Ambient Glows */}
        <div className="liquid-prism-glow" style={{ position: 'fixed', top: '-10%', right: '-10%', width: '600px', height: '600px', pointerEvents: 'none', opacity: 0.5 }} />
        <div className="liquid-prism-glow" style={{ position: 'fixed', bottom: '-5%', left: '5%', width: '400px', height: '400px', pointerEvents: 'none', opacity: 0.3 }} />

        {/* Header */}
        <header style={{ padding: '48px 40px 32px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <h2 className="font-headline" style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
                Welcome back, <span style={{ color: 'var(--primary-fixed-dim)' }}>Professor Smith</span>
              </h2>
              <p style={{ color: 'var(--on-surface-variant)', fontWeight: 500, letterSpacing: '0.02em' }}>Ready to orchestrate today's cognitive experience?</p>
            </div>
            <button onClick={() => setShowModal(true)} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '16px 32px',
              backgroundColor: '#6366F1',
              color: 'white', fontWeight: 700, borderRadius: '16px', border: 'none', cursor: 'pointer',
              boxShadow: '0 20px 50px rgba(99, 102, 241, 0.3)',
              transition: 'all 0.3s',
              fontSize: '15px',
            }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '20px' }}>add_circle</span>
              <span>Start New Session</span>
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <section style={{ padding: '0 40px', marginBottom: '48px', position: 'sticky', top: 0, zIndex: 30, paddingTop: '16px' }}>
          <div className="glass-highlight" style={{
            backgroundColor: 'rgba(24, 28, 33, 0.6)',
            backdropFilter: 'blur(30px)',
            borderRadius: '16px',
            padding: '8px',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '0 16px', gap: '12px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--outline)' }}>search</span>
              <input type="text" placeholder="Search lesson plans, archives, or AI prompts..." style={{
                background: 'transparent', border: 'none', outline: 'none', width: '100%',
                color: 'var(--on-surface)', fontSize: '14px', fontWeight: 500, padding: '12px 0',
              }} />
            </div>
            <div style={{ height: '32px', width: '1px', background: 'rgba(70, 69, 84, 0.2)', margin: '0 8px' }} />
            <div style={{ display: 'flex', gap: '4px', padding: '0 8px' }}>
              <button style={{
                padding: '8px 16px', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: 'var(--primary-fixed-dim)', background: 'transparent',
                border: 'none', borderRadius: '12px', cursor: 'pointer',
              }}>Sort: Recent</button>
              <button style={{ padding: '8px', color: 'var(--on-surface-variant)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <span className="material-symbols-outlined">filter_list</span>
              </button>
            </div>
          </div>
        </section>

        {/* Lesson Grid */}
        <section style={{ padding: '0 40px 96px', position: 'relative', zIndex: 10 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
            {sessionCards.map((card, i) => (
              <div key={i} className="glass-highlight" style={{
                position: 'relative',
                backgroundColor: 'rgba(28, 32, 37, 0.4)',
                backdropFilter: 'blur(20px)',
                borderRadius: '32px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.5s',
                borderTop: card.highlighted ? '2px solid rgba(74, 225, 118, 0.2)' : undefined,
              }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(38, 42, 48, 0.6)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(28, 32, 37, 0.4)'}
              >
                <div className="noise-texture" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
                <div style={{ padding: '32px 32px 16px', flex: 1 }}>
                  {/* Top Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '16px',
                      backgroundColor: card.highlighted ? 'rgba(74, 225, 118, 0.1)' : 'rgba(192, 193, 255, 0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: card.highlighted ? 'var(--secondary)' : 'var(--primary-fixed-dim)',
                      transition: 'transform 0.5s',
                    }}>
                      <span className="material-symbols-outlined filled">{card.icon}</span>
                    </div>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                      padding: '4px 12px',
                      backgroundColor: card.statusColor === 'var(--secondary)' ? 'rgba(74, 225, 118, 0.1)' : 'rgba(192, 193, 255, 0.1)',
                      color: card.statusColor,
                      borderRadius: '999px',
                    }}>{card.status}</span>
                  </div>
                  {/* Title & Description */}
                  <h3 className="font-headline" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', transition: 'color 0.3s' }}>{card.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '24px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {card.desc}
                  </p>
                  {/* Heatmap Thumbnail */}
                  <div style={{
                    position: 'relative', width: '100%', height: '96px',
                    backgroundColor: card.heatmapBars ? 'var(--surface-container-lowest)' : 'transparent',
                    borderRadius: '16px', overflow: 'hidden', marginBottom: '24px',
                    display: 'flex', alignItems: card.heatmapBars ? 'flex-end' : 'center',
                    justifyContent: card.heatmapBars ? 'space-between' : 'center',
                    padding: card.heatmapBars ? '4px' : undefined,
                    border: card.heatmapBars ? '1px solid rgba(255, 255, 255, 0.05)' : '1px dashed rgba(70, 69, 84, 0.3)',
                  }}>
                    {card.heatmapBars ? (
                      <>
                        {card.heatmapBars.map((h, j) => (
                          <div key={j} style={{
                            width: '8px',
                            height: `${h}%`,
                            borderRadius: '2px 2px 0 0',
                            backgroundColor: card.highlighted
                              ? `rgba(74, 225, 118, 0.8)`
                              : `rgba(${j % 2 === 0 ? '192, 193, 255' : '74, 225, 118'}, ${0.2 + (h / 200)})`,
                          }} />
                        ))}
                        <div style={{ position: 'absolute', top: '8px', left: '12px', fontSize: '9px', textTransform: 'uppercase', fontWeight: 700, color: card.highlighted ? 'rgba(74, 225, 118, 0.6)' : 'rgba(199, 196, 215, 0.4)', letterSpacing: '-0.01em' }}>
                          {card.heatmapLabel}
                        </div>
                      </>
                    ) : (
                      <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(199, 196, 215, 0.3)', letterSpacing: '0.1em' }}>No session data yet</span>
                    )}
                  </div>
                </div>
                {/* Footer */}
                <div style={{ padding: '20px 32px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                  {card.rating ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined filled" style={{ fontSize: '14px', color: 'var(--secondary)' }}>star</span>
                      <span style={{ fontSize: '12px', fontWeight: 700 }}>{card.rating}</span>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>schedule</span>
                    </div>
                  )}
                  <span style={{ fontSize: '12px', fontWeight: 500, color: 'var(--on-surface-variant)' }}>{card.footer}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Refraction Pane — AI Insight Oracle */}
        <section style={{ padding: '0 40px 80px' }}>
          <div style={{
            position: 'relative',
            backgroundColor: 'rgba(38, 42, 48, 0.4)',
            backdropFilter: 'blur(40px)',
            borderRadius: '40px',
            padding: '40px',
            borderTop: '2px solid rgba(74, 225, 118, 0.3)',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          }}>
            <div className="noise-texture" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 10, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'center' }}>
              <div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '4px 16px', borderRadius: '999px',
                  backgroundColor: 'rgba(74, 225, 118, 0.1)',
                  border: '1px solid rgba(74, 225, 118, 0.2)',
                  marginBottom: '24px',
                }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--secondary)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                  <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>AI Insight Oracle</span>
                </div>
                <h3 className="font-headline" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '16px' }}>Class Performance Forecast</h3>
                <p style={{ color: 'var(--on-surface-variant)', lineHeight: 1.6, marginBottom: '32px' }}>
                  Based on your last 3 sessions, the "React Hooks" module shows a 12% increase in conceptual retention. We suggest running a quick "Refresher" session on <span style={{ color: 'var(--primary)', fontWeight: 700 }}>UseCallback</span> before starting the next block.
                </p>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <button style={{
                    padding: '12px 24px', borderRadius: '12px',
                    backgroundColor: 'var(--surface-container-highest)', color: 'var(--on-surface)',
                    fontWeight: 700, fontSize: '14px', border: '1px solid rgba(255, 255, 255, 0.05)',
                    cursor: 'pointer', transition: 'background 0.2s',
                  }}>Review Full Report</button>
                  <button style={{
                    padding: '12px 24px', borderRadius: '12px',
                    backgroundColor: 'rgba(192, 193, 255, 0.2)', color: 'var(--primary-fixed-dim)',
                    fontWeight: 700, fontSize: '14px', border: '1px solid rgba(192, 193, 255, 0.3)',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}>Optimize My Deck</button>
                </div>
              </div>
              {/* SVG Visualization */}
              <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '280px', height: '280px', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top right, rgba(192, 193, 255, 0.2), rgba(74, 225, 118, 0.2))', borderRadius: '50%', filter: 'blur(48px)', opacity: 0.4 }} />
                  <svg width="280" height="280" viewBox="0 0 200 200" fill="none" style={{ position: 'absolute', inset: 0 }}>
                    <circle cx="100" cy="100" r="80" stroke="url(#paint0)" strokeWidth="0.5" strokeDasharray="10 10" />
                    <circle cx="100" cy="100" r="60" stroke="url(#paint1)" strokeWidth="1" strokeDasharray="5 5" />
                    <path d="M100 20L100 180" stroke="url(#paint2)" strokeWidth="0.5" opacity="0.3" />
                    <path d="M20 100L180 100" stroke="url(#paint2)" strokeWidth="0.5" opacity="0.3" />
                    <defs>
                      <linearGradient id="paint0" x1="20" y1="20" x2="180" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#c0c1ff" /><stop offset="1" stopColor="#4ae176" />
                      </linearGradient>
                      <linearGradient id="paint1" x1="40" y1="40" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#4ae176" /><stop offset="1" stopColor="#c0c1ff" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="paint2" x1="100" y1="20" x2="100" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#e0e2ea" /><stop offset="1" stopColor="#e0e2ea" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="font-headline" style={{ fontSize: '36px', fontWeight: 900 }}>94%</span>
                    <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)' }}>Cognitive Sync</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {showModal && <StartSessionModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
