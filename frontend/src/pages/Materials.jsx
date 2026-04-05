import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:3001';

/* ═══════════════════════════════════════════════ */
/*  DATA — Twin-Enriched Materials                  */
/* ═══════════════════════════════════════════════ */
const sampleMaterials = [
  {
    id: 1, title: 'Introduction to Algebra', type: 'Lesson Plan', subject: 'Mathematics',
    status: 'Published', date: 'Nov 12, 2024', icon: 'calculate', color: '#8083ff',
    description: 'Covers variables, expressions, and basic equations for Grade 8.',
    slides: 24, duration: '45 min',
    // Twin-Aware Data
    engagement: 'high', confusionZone: false, predictedSuccess: 88,
    twinSync: true, sessionsUsed: 5, avgScore: 82,
    bottleneck: 'Slide 14-17: Students lose focus during factoring section.',
    hasSimulation: false,
  },
  {
    id: 2, title: 'Cell Biology Fundamentals', type: 'Presentation', subject: 'Science',
    status: 'Draft', date: 'Nov 10, 2024', icon: 'biotech', color: '#4ae176',
    description: 'Cell structure, organelles, and cellular processes with interactive diagrams.',
    slides: 32, duration: '50 min',
    engagement: 'medium', confusionZone: true, predictedSuccess: 64,
    twinSync: false, sessionsUsed: 3, avgScore: 61,
    bottleneck: 'Slide 8-12: Mitochondria vs. chloroplast confusion is recurring.',
    hasSimulation: true,
  },
  {
    id: 3, title: 'World War II Timeline', type: 'Worksheet', subject: 'History',
    status: 'Published', date: 'Nov 8, 2024', icon: 'history_edu', color: '#ffb95f',
    description: 'Key events from 1939–1945 with map activities and comprehension questions.',
    slides: 12, duration: '30 min',
    engagement: 'high', confusionZone: false, predictedSuccess: 91,
    twinSync: true, sessionsUsed: 7, avgScore: 89,
    bottleneck: null,
    hasSimulation: false,
  },
  {
    id: 4, title: 'Creative Writing Prompts', type: 'Activity', subject: 'English',
    status: 'Published', date: 'Nov 5, 2024', icon: 'edit_note', color: '#ff6b9d',
    description: 'Collection of 20 imaginative prompts for narrative and descriptive writing.',
    slides: 20, duration: '40 min',
    engagement: 'medium', confusionZone: false, predictedSuccess: 79,
    twinSync: false, sessionsUsed: 4, avgScore: 76,
    bottleneck: 'Slide 15-18: Students need more examples for descriptive writing.',
    hasSimulation: false,
  },
  {
    id: 5, title: 'Quadratic Equations Deep Dive', type: 'Lesson Plan', subject: 'Mathematics',
    status: 'Review', date: 'Nov 3, 2024', icon: 'functions', color: '#8083ff',
    description: 'Advanced quadratic formula, discriminant analysis, and graphing parabolas.',
    slides: 28, duration: '55 min',
    engagement: 'low', confusionZone: true, predictedSuccess: 52,
    twinSync: false, sessionsUsed: 2, avgScore: 48,
    bottleneck: 'Slides 6-20: Discriminant concept causes widespread confusion.',
    hasSimulation: false,
  },
  {
    id: 6, title: 'Climate Change & Ecosystems', type: 'Presentation', subject: 'Science',
    status: 'Published', date: 'Oct 28, 2024', icon: 'eco', color: '#4ae176',
    description: 'Impact of climate change on global ecosystems with case studies.',
    slides: 36, duration: '60 min',
    engagement: 'high', confusionZone: false, predictedSuccess: 85,
    twinSync: true, sessionsUsed: 6, avgScore: 84,
    bottleneck: null,
    hasSimulation: true,
  },
];

const typeFilters = ['All', 'Lesson Plan', 'Presentation', 'Worksheet', 'Activity'];
const subjectFilters = ['All', 'Mathematics', 'Science', 'History', 'English'];

/* ═══════════════════════════════════════════════ */
/*  AI RECOMMENDATION PANEL                        */
/* ═══════════════════════════════════════════════ */
function RecommendationPanel() {
  const recommendations = [
    {
      material: 'Introduction to Algebra',
      reason: 'Based on 8 students who scored below 60% in yesterday\'s quiz, start with a review before advancing.',
      urgency: 'high',
      icon: 'priority_high',
    },
    {
      material: 'Cell Biology Fundamentals',
      reason: 'Twin detected 70% confusion on mitochondria slides. Auto-remediation available.',
      urgency: 'medium',
      icon: 'healing',
    },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(26,92,59,0.04), rgba(45,122,82,0.07))',
      border: '1px solid rgba(26,92,59,0.12)',
      borderRadius: '18px', padding: '20px', marginBottom: '28px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: '32px', height: '32px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #1A5C3B, #2D7A52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 10px rgba(26,92,59,0.2)',
        }}>
          <span className="material-symbols-outlined filled" style={{ fontSize: '16px', color: '#4DE89A' }}>neurology</span>
        </div>
        <div>
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A5C3B' }}>
            AI Recommended for Today
          </span>
          <span style={{
            marginLeft: '8px', fontSize: '10px', fontWeight: 600,
            padding: '2px 8px', borderRadius: '10px',
            background: '#E8F5EE', color: '#1A5C3B',
          }}>LIVE</span>
        </div>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#9CA3AF', fontWeight: 500 }}>
          Analyzing 24 students • 3 recent sessions
        </span>
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        {recommendations.map((r, i) => (
          <div key={i} style={{
            flex: 1, background: '#FFFFFF', borderRadius: '14px',
            padding: '16px', border: '1px solid #EAECF0',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px', flexShrink: 0,
              background: r.urgency === 'high' ? '#FEF2F2' : '#FFFBEB',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: '16px', color: r.urgency === 'high' ? '#EF4444' : '#F59E0B',
              }}>{r.icon}</span>
            </div>
            <div>
              <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', marginBottom: '4px' }}>{r.material}</p>
              <p style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.5 }}>{r.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  SIMULATION MODAL                                */
/* ═══════════════════════════════════════════════ */
function SimulationModal({ material, onClose }) {
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);

  const runSimulation = () => {
    setRunning(true);
    setTimeout(() => {
      setResult({
        predictedEngagement: Math.round(65 + Math.random() * 25),
        bottleneckSlides: material.bottleneck || 'No major bottlenecks predicted.',
        recommendedPacing: material.slides > 24 ? 'Slow down at slides 12-18. Consider a 5-min micro-break.' : 'Pacing looks optimal for this class size.',
        riskStudents: Math.round(2 + Math.random() * 5),
        estimatedCompletion: material.duration,
      });
      setRunning(false);
    }, 2500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
      backdropFilter: 'blur(6px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '32px',
        maxWidth: '560px', width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        animation: 'modalIn 0.3s ease',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #8B5CF6, #A855F7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(139,92,246,0.3)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff' }}>science</span>
          </div>
          <div>
            <h3 className="font-headline" style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Pre-Lesson Simulation
            </h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
              {material.title} • {material.slides} slides • {material.duration}
            </p>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', width: '32px', height: '32px', borderRadius: '8px',
            background: '#F3F4F6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6B7280' }}>close</span>
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
          Based on this class's historical data in your Digital Twin, simulate a session using <strong style={{ color: '#111827' }}>{material.title}</strong>.
          The AI will predict engagement bottlenecks, at-risk students, and pacing recommendations.
        </p>

        {!result && (
          <button onClick={runSimulation} disabled={running} style={{
            width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
            background: running ? '#F3F4F6' : 'linear-gradient(135deg, #8B5CF6, #A855F7)',
            color: running ? '#6B7280' : '#fff',
            fontWeight: 600, fontSize: '14px', cursor: running ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: running ? 'none' : '0 6px 20px rgba(139,92,246,0.3)',
            transition: 'all 0.2s',
          }}>
            {running ? (
              <>
                <div style={{ width: '18px', height: '18px', border: '2px solid #9CA3AF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Running Simulation…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
                Run Pre-Lesson Simulation
              </>
            )}
          </button>
        )}

        {result && (
          <div style={{ animation: 'modalIn 0.3s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: '#F0FDF4', borderRadius: '14px', padding: '16px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>Predicted Engagement</p>
                <p className="font-headline" style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>{result.predictedEngagement}%</p>
              </div>
              <div style={{ background: '#FEF2F2', borderRadius: '14px', padding: '16px', border: '1px solid rgba(239,68,68,0.15)' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>At-Risk Students</p>
                <p className="font-headline" style={{ fontSize: '28px', fontWeight: 800, color: '#111827' }}>{result.riskStudents}</p>
              </div>
            </div>

            <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '16px', marginBottom: '12px', border: '1px solid #EAECF0' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#F59E0B', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
                PREDICTED BOTTLENECK
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{result.bottleneckSlides}</p>
            </div>

            <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '16px', border: '1px solid #EAECF0' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#3B82F6', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>speed</span>
                PACING RECOMMENDATION
              </p>
              <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>{result.recommendedPacing}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════ */
/*  REMEDIATION MODAL                               */
/* ═══════════════════════════════════════════════ */
function RemediationModal({ material, onClose }) {
  const [generating, setGenerating] = useState(false);
  const [done, setDone] = useState(false);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setDone(true); }, 3000);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
      backdropFilter: 'blur(6px)',
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#fff', borderRadius: '24px', padding: '32px',
        maxWidth: '480px', width: '90%', boxShadow: '0 24px 64px rgba(0,0,0,0.15)',
        animation: 'modalIn 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, #F59E0B, #EAB308)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245,158,11,0.3)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff' }}>healing</span>
          </div>
          <div>
            <h3 className="font-headline" style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
              Auto-Generate Remediation
            </h3>
            <p style={{ fontSize: '12px', color: '#9CA3AF' }}>{material.title}</p>
          </div>
          <button onClick={onClose} style={{
            marginLeft: 'auto', width: '32px', height: '32px', borderRadius: '8px',
            background: '#F3F4F6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#6B7280' }}>close</span>
          </button>
        </div>

        {material.bottleneck && (
          <div style={{ background: '#FFFBEB', borderRadius: '12px', padding: '14px', marginBottom: '16px', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: '#92400E', marginBottom: '4px' }}>⚠️ DETECTED CONFUSION ZONE</p>
            <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.5 }}>{material.bottleneck}</p>
          </div>
        )}

        <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6, marginBottom: '20px' }}>
          The AI will analyze student engagement logs and generate a custom remedial worksheet targeting the specific confusion points identified by the Twin Engine.
        </p>

        {!done ? (
          <button onClick={generate} disabled={generating} style={{
            width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
            background: generating ? '#F3F4F6' : 'linear-gradient(135deg, #F59E0B, #EAB308)',
            color: generating ? '#6B7280' : '#fff',
            fontWeight: 600, fontSize: '14px', cursor: generating ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            boxShadow: generating ? 'none' : '0 6px 20px rgba(245,158,11,0.3)',
          }}>
            {generating ? (
              <>
                <div style={{ width: '18px', height: '18px', border: '2px solid #9CA3AF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Generating remedial content…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>auto_awesome</span>
                Generate Remedial Slide
              </>
            )}
          </button>
        ) : (
          <div style={{ textAlign: 'center', animation: 'modalIn 0.3s ease' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', margin: '0 auto 16px',
              background: '#E8F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span className="material-symbols-outlined filled" style={{ fontSize: '28px', color: '#1A5C3B' }}>check_circle</span>
            </div>
            <h4 className="font-headline" style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              Remedial Content Generated!
            </h4>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
              1 remedial worksheet has been created and is ready to be injected into the live session.
            </p>
            <button onClick={onClose} style={{
              padding: '12px 32px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #1A5C3B, #2D7A52)',
              color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(26,92,59,0.25)',
            }}>
              Inject into Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════ */
/*  MAIN COMPONENT                                 */
/* ═══════════════════════════════════════════════ */
export default function Materials() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('All');
  const [activeSubject, setActiveSubject] = useState('All');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [simModal, setSimModal] = useState(null);
  const [remModal, setRemModal] = useState(null);

  const filtered = sampleMaterials.filter(m => {
    const matchesSearch = m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeType === 'All' || m.type === activeType;
    const matchesSubject = activeSubject === 'All' || m.subject === activeSubject;
    return matchesSearch && matchesType && matchesSubject;
  });

  const statusStyle = (status) => {
    switch (status) {
      case 'Published': return { background: '#E8F5EE', color: '#1A5C3B', border: '1px solid rgba(26, 92, 59, 0.15)' };
      case 'Draft': return { background: '#FEF9C3', color: '#92400E', border: '1px solid rgba(146, 64, 14, 0.15)' };
      case 'Review': return { background: '#EFF6FF', color: '#1D4ED8', border: '1px solid rgba(29, 78, 216, 0.15)' };
      default: return {};
    }
  };

  const engagementBadge = (m) => {
    if (m.confusionZone) return { text: '⚠️ High Confusion Zone', bg: '#FEF2F2', color: '#B91C1C', border: 'rgba(239,68,68,0.15)' };
    if (m.engagement === 'high') return { text: '🔥 High Engagement', bg: '#F0FDF4', color: '#15803D', border: 'rgba(22,163,74,0.15)' };
    if (m.engagement === 'medium') return { text: '📊 Moderate Engagement', bg: '#FFFBEB', color: '#92400E', border: 'rgba(245,158,11,0.15)' };
    return { text: '📉 Low Engagement', bg: '#FEF2F2', color: '#B91C1C', border: 'rgba(239,68,68,0.15)' };
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#F5F6FA', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <h1 className="font-headline" style={{
              fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', color: '#111827',
            }}>Teaching Materials</h1>
            <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '6px' }}>
              Twin-aware content engine — materials adapt based on live student data.
            </p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'Total Materials', value: '24', icon: 'folder', color: '#8083ff' },
            { label: 'Published', value: '18', icon: 'check_circle', color: '#4ae176' },
            { label: 'In Draft', value: '4', icon: 'edit_note', color: '#ffb95f' },
            { label: 'AI Optimized', value: '6', icon: 'auto_awesome', color: '#1A5C3B', highlight: true },
          ].map((stat, i) => (
            <div key={i} style={{
              backgroundColor: stat.highlight ? '#F0FDF4' : '#FFFFFF', borderRadius: '16px',
              padding: '20px', border: stat.highlight ? '1px solid rgba(26,92,59,0.15)' : '1px solid #EAECF0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', gap: '16px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: stat.highlight ? 'linear-gradient(135deg, #1A5C3B, #2D7A52)' : `${stat.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: stat.highlight ? '0 4px 12px rgba(26,92,59,0.2)' : 'none',
              }}>
                <span className="material-symbols-outlined filled" style={{
                  color: stat.highlight ? '#4DE89A' : stat.color, fontSize: '22px',
                }}>{stat.icon}</span>
              </div>
              <div>
                <div className="font-headline" style={{ fontSize: '22px', fontWeight: 700, color: '#111827' }}>{stat.value}</div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>{stat.label}</div>
              </div>
              {stat.highlight && (
                <span style={{
                  marginLeft: 'auto', fontSize: '10px', fontWeight: 700,
                  padding: '3px 8px', borderRadius: '10px',
                  background: '#E8F5EE', color: '#1A5C3B',
                }}>TWIN</span>
              )}
            </div>
          ))}
        </div>

        {/* AI Recommendations */}
        <RecommendationPanel />

        {/* Search & Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{
            flex: 1, minWidth: '260px',
            display: 'flex', alignItems: 'center', gap: '10px',
            backgroundColor: '#FFFFFF', borderRadius: '12px',
            padding: '10px 16px', border: '1px solid #EAECF0',
          }}>
            <span className="material-symbols-outlined" style={{ color: '#9CA3AF', fontSize: '20px' }}>search</span>
            <input
              type="text"
              placeholder="Search materials..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                background: 'none', border: 'none', outline: 'none',
                color: '#111827', fontSize: '14px', width: '100%',
                fontFamily: "'Inter', sans-serif",
              }}
            />
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', borderRadius: '12px', border: 'none',
            background: 'linear-gradient(135deg, #1A5C3B, #2D7A52)',
            color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(26, 92, 59, 0.25)',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
            New Material
          </button>
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, alignSelf: 'center', marginRight: '4px' }}>TYPE:</span>
          {typeFilters.map(f => (
            <button key={f} onClick={() => setActiveType(f)} style={{
              padding: '6px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeType === f ? '#E8F5EE' : '#F9FAFB',
              color: activeType === f ? '#1A5C3B' : '#6B7280',
              border: activeType === f ? '1px solid rgba(26,92,59,0.2)' : '1px solid #EAECF0',
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 600, alignSelf: 'center', marginRight: '4px' }}>SUBJECT:</span>
          {subjectFilters.map(f => (
            <button key={f} onClick={() => setActiveSubject(f)} style={{
              padding: '6px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: 500, cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeSubject === f ? '#E8F5EE' : '#F9FAFB',
              color: activeSubject === f ? '#1A5C3B' : '#6B7280',
              border: activeSubject === f ? '1px solid rgba(26,92,59,0.2)' : '1px solid #EAECF0',
            }}>{f}</button>
          ))}
        </div>

        {/* Materials Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
          {filtered.map(m => {
            const eb = engagementBadge(m);
            return (
              <div
                key={m.id}
                onMouseEnter={() => setHoveredCard(m.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px', padding: '24px',
                  border: hoveredCard === m.id ? '1px solid #D1D5DB' : '1px solid #EAECF0',
                  boxShadow: hoveredCard === m.id ? '0 8px 28px rgba(0,0,0,0.08)' : '0 2px 8px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === m.id ? 'translateY(-3px)' : 'none',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                }}
              >
                {/* Top row: icon + badges */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '14px',
                    background: `${m.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span className="material-symbols-outlined filled" style={{ color: m.color, fontSize: '24px' }}>{m.icon}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    {/* Twin Sync indicator */}
                    <span title={m.twinSync ? 'Live Twin Sync active' : 'Not synced'} style={{
                      width: '24px', height: '24px', borderRadius: '6px',
                      background: m.twinSync ? '#E8F5EE' : '#F3F4F6',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: `1px solid ${m.twinSync ? 'rgba(26,92,59,0.15)' : '#EAECF0'}`,
                    }}>
                      <span className="material-symbols-outlined" style={{
                        fontSize: '14px', color: m.twinSync ? '#1A5C3B' : '#D1D5DB',
                      }}>sync</span>
                    </span>
                    {/* Status badge */}
                    <span style={{
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em',
                      ...statusStyle(m.status),
                    }}>{m.status.toUpperCase()}</span>
                  </div>
                </div>

                {/* Title & description */}
                <h3 className="font-headline" style={{
                  fontSize: '16px', fontWeight: 700, color: '#111827',
                  marginBottom: '6px', lineHeight: 1.3,
                }}>{m.title}</h3>
                <p style={{
                  fontSize: '13px', color: '#6B7280',
                  lineHeight: 1.5, marginBottom: '14px',
                  display: '-webkit-box', WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>{m.description}</p>

                {/* Twin-Aware Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: eb.bg, color: eb.color, border: `1px solid ${eb.border}`,
                  }}>{eb.text}</span>
                  <span style={{
                    padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
                    background: m.predictedSuccess >= 80 ? '#F0FDF4' : m.predictedSuccess >= 65 ? '#FFFBEB' : '#FEF2F2',
                    color: m.predictedSuccess >= 80 ? '#15803D' : m.predictedSuccess >= 65 ? '#92400E' : '#B91C1C',
                    border: `1px solid ${m.predictedSuccess >= 80 ? 'rgba(22,163,74,0.15)' : m.predictedSuccess >= 65 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)'}`,
                  }}>📈 Predicted: {m.predictedSuccess}%</span>
                </div>

                {/* Meta row */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  fontSize: '12px', color: '#9CA3AF',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>slideshow</span>
                    {m.slides} slides
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                    {m.duration}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>science</span>
                    {m.subject}
                  </span>
                  {m.twinSync && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1A5C3B', fontWeight: 600 }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>sync</span>
                      Live
                    </span>
                  )}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', margin: '14px 0', background: '#F3F4F6' }} />

                {/* Action buttons row */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={(e) => { e.stopPropagation(); setSimModal(m); }}
                    style={{
                      flex: 1, padding: '9px 12px', borderRadius: '10px',
                      background: '#F5F3FF', border: '1px solid rgba(139,92,246,0.15)',
                      color: '#7C3AED', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = '#EDE9FE'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseOut={e => { e.currentTarget.style.background = '#F5F3FF'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>science</span>
                    Simulate Lesson
                  </button>
                  {m.confusionZone && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setRemModal(m); }}
                      style={{
                        flex: 1, padding: '9px 12px', borderRadius: '10px',
                        background: '#FFFBEB', border: '1px solid rgba(245,158,11,0.15)',
                        color: '#92400E', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#FEF3C7'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#FFFBEB'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>healing</span>
                      Auto-Remediate
                    </button>
                  )}
                  {m.hasSimulation && (
                    <button
                      style={{
                        flex: 1, padding: '9px 12px', borderRadius: '10px',
                        background: '#E8F5EE', border: '1px solid rgba(26,92,59,0.15)',
                        color: '#1A5C3B', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                        transition: 'all 0.2s',
                      }}
                      onMouseOver={e => { e.currentTarget.style.background = '#D1FAE5'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                      onMouseOut={e => { e.currentTarget.style.background = '#E8F5EE'; e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>view_in_ar</span>
                      Launch Twin
                    </button>
                  )}
                </div>

                {/* Bottom date row */}
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontSize: '11px', color: '#9CA3AF', marginTop: '12px',
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>calendar_today</span>
                    {m.date}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>bar_chart</span>
                    {m.sessionsUsed} sessions • avg {m.avgScore}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '80px 20px', color: '#6B7280',
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '56px', opacity: 0.3, marginBottom: '16px', display: 'block' }}>search_off</span>
            <p style={{ fontSize: '16px', fontWeight: 600 }}>No materials found</p>
            <p style={{ fontSize: '13px', opacity: 0.6, marginTop: '8px' }}>Try adjusting your filters or search query.</p>
          </div>
        )}
      </main>

      {/* Modals */}
      {simModal && <SimulationModal material={simModal} onClose={() => setSimModal(null)} />}
      {remModal && <RemediationModal material={remModal} onClose={() => setRemModal(null)} />}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
