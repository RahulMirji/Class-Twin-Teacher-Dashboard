import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import StartSessionModal from '../components/StartSessionModal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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
  const [pastSessions, setPastSessions] = useState([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Professor';

  useEffect(() => {
    fetchPastSessions();
  }, []);

  async function fetchPastSessions() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/sessions`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPastSessions(data);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoadingSessions(false);
    }
  }

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
                Welcome back, <span style={{ color: 'var(--primary-fixed-dim)' }}>{displayName}</span>
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
                  {/* Data Visualization */}
                  <div style={{
                    position: 'relative', width: '100%', height: '110px',
                    borderRadius: '16px', overflow: 'hidden', marginBottom: '24px',
                    border: card.heatmapBars ? '1px solid rgba(255, 255, 255, 0.06)' : '1px dashed rgba(70, 69, 84, 0.3)',
                    background: card.heatmapBars
                      ? 'linear-gradient(180deg, rgba(10, 14, 19, 0.6) 0%, rgba(16, 20, 25, 0.9) 100%)'
                      : 'transparent',
                  }}>
                    {card.heatmapBars ? (() => {
                      const barCount = card.heatmapBars.length;
                      const barWidth = 20;
                      const gap = 6;
                      const totalW = barCount * (barWidth + gap) - gap;
                      const svgW = totalW + 32;
                      const svgH = 110;
                      const maxH = svgH - 30;
                      const gradId = `barGrad_${i}`;
                      const glowId = `barGlow_${i}`;
                      const areaId = `areaGrad_${i}`;
                      const isGreen = card.highlighted;
                      const c1 = isGreen ? '#4ae176' : '#8083ff';
                      const c2 = isGreen ? '#2dd573' : '#c0c1ff';

                      // Build area path (smooth curve connecting bar tops)
                      const points = card.heatmapBars.map((h, j) => {
                        const x = 16 + j * (barWidth + gap) + barWidth / 2;
                        const y = svgH - 6 - (h / 100) * maxH;
                        return { x, y };
                      });
                      const areaPath = points.reduce((acc, p, idx) => {
                        if (idx === 0) return `M${p.x},${p.y}`;
                        const prev = points[idx - 1];
                        const cx = (prev.x + p.x) / 2;
                        return `${acc} C${cx},${prev.y} ${cx},${p.y} ${p.x},${p.y}`;
                      }, '') + ` L${points[points.length - 1].x},${svgH} L${points[0].x},${svgH} Z`;

                      return (
                        <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} preserveAspectRatio="none" style={{ display: 'block' }}>
                          <defs>
                            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={c1} stopOpacity="0.9" />
                              <stop offset="100%" stopColor={c2} stopOpacity="0.4" />
                            </linearGradient>
                            <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={c1} stopOpacity="0.12" />
                              <stop offset="100%" stopColor={c1} stopOpacity="0.01" />
                            </linearGradient>
                            <filter id={glowId}>
                              <feGaussianBlur stdDeviation="3" result="blur" />
                              <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                              </feMerge>
                            </filter>
                          </defs>

                          {/* Subtle horizontal grid lines */}
                          {[0.25, 0.5, 0.75].map((frac, gi) => (
                            <line key={gi} x1="16" y1={svgH - 6 - frac * maxH} x2={svgW - 16} y2={svgH - 6 - frac * maxH}
                              stroke="rgba(224, 226, 234, 0.04)" strokeWidth="1" strokeDasharray="4 4" />
                          ))}

                          {/* Area fill behind bars */}
                          <path d={areaPath} fill={`url(#${areaId})`} />

                          {/* Bars */}
                          {card.heatmapBars.map((h, j) => {
                            const barH = (h / 100) * maxH;
                            const x = 16 + j * (barWidth + gap);
                            const y = svgH - 6 - barH;
                            return (
                              <g key={j}>
                                <rect x={x} y={y} width={barWidth} height={barH}
                                  rx="4" ry="4"
                                  fill={`url(#${gradId})`}
                                  filter={h > 70 ? `url(#${glowId})` : undefined}
                                  style={{ transition: 'all 0.3s' }}
                                />
                                {/* Highlight cap on tall bars */}
                                {h > 60 && (
                                  <rect x={x} y={y} width={barWidth} height="3"
                                    rx="2" ry="2"
                                    fill={c1} opacity="0.7"
                                  />
                                )}
                              </g>
                            );
                          })}

                          {/* Label */}
                          <text x="16" y="16" fill={isGreen ? 'rgba(74, 225, 118, 0.5)' : 'rgba(192, 193, 255, 0.4)'}
                            fontSize="8" fontWeight="700" textAnchor="start"
                            style={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>
                            {card.heatmapLabel}
                          </text>
                        </svg>
                      );
                    })() : (
                      <div style={{
                        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', gap: '8px',
                      }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'rgba(199, 196, 215, 0.15)' }}>bar_chart</span>
                        <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(199, 196, 215, 0.2)', letterSpacing: '0.1em' }}>No session data yet</span>
                      </div>
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
