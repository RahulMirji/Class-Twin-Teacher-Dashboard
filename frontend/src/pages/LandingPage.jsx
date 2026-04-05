import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  {
    icon: 'auto_awesome', title: 'Digital Twin Technology', color: 'var(--primary)',
    bg: 'var(--primary-light)',
    desc: 'Create a real-time heatmap of student understanding. Every interaction is mapped to a digital mirror of your physical classroom.',
    illustration: 'bar_chart',
  },
  {
    icon: 'bolt', title: 'AI Interventions', color: 'var(--accent-blue)',
    bg: '#EFF6FF',
    desc: 'Context-aware suggestions triggered the moment a student hits a cognitive block. Move from passive lecturing to active orchestration.',
    illustration: null,
  },
  {
    icon: 'star', title: 'Reflective Loops', color: 'var(--accent-amber)',
    bg: '#FEF9C3',
    desc: 'Generate longitudinal growth profiles for every student, automatically identifying hidden potential and systemic gaps.',
    illustration: null,
  },
  {
    icon: 'insights', title: 'Post-Session Insights', color: 'var(--accent-purple)',
    bg: '#F3E8FF',
    desc: 'Review your teaching efficacy through a new lens. AI-powered analytics refine your future lesson plans based on actual student reception.',
    illustration: null,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { signInWithGoogle, user, loading } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAuth = async () => {
    if (user) {
      navigate('/sessions');
      return;
    }
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Google sign-in error:', err);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--background)', color: 'var(--on-surface)', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* ─── Top Nav ─── */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: scrolled ? '12px 40px' : '16px 40px',
        position: 'sticky', top: 0, zIndex: 50,
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.6)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid var(--outline)' : '1px solid transparent',
        transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: scrolled ? '0 1px 12px rgba(0, 0, 0, 0.06)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--primary), var(--inverse-primary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(26, 92, 59, 0.2)',
          }}>
            <span className="material-symbols-outlined filled" style={{ color: '#fff', fontSize: '18px' }}>auto_awesome</span>
          </div>
          <span className="font-headline" style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>ClassTwin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {['Features', 'Pricing', 'Case Studies'].map((label) => (
            <a
              key={label}
              href={label === 'Features' ? '#features' : '#'}
              style={{
                color: 'var(--on-surface-variant)', fontSize: '14px', fontWeight: 500,
                transition: 'color 0.25s',
                position: 'relative',
              }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
            >{label}</a>
          ))}
          <button onClick={handleAuth} className="ct-btn-primary" style={{
            padding: '10px 24px',
            fontSize: '14px',
            borderRadius: '50px',
          }}>Get Started</button>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 40px 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient Glows — soft for light theme */}
        <div style={{ position: 'absolute', top: '-15%', left: '15%', width: '600px', height: '600px', background: 'rgba(26, 92, 59, 0.05)', filter: 'blur(120px)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '15%', width: '400px', height: '400px', background: 'rgba(59, 130, 246, 0.04)', filter: 'blur(100px)', borderRadius: '50%' }} />

        <p style={{
          fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em',
          color: 'var(--primary)', fontWeight: 700, marginBottom: '24px',
          padding: '6px 16px', borderRadius: '50px',
          backgroundColor: 'var(--primary-light)',
          display: 'inline-block',
        }}>CLASSROOM AI ENGINE</p>

        <h1 className="font-headline" style={{
          fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 800,
          letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '24px',
          maxWidth: '820px', color: 'var(--on-surface)',
        }}>
          The First AI Digital Twin for{' '}
          <span style={{
            background: 'linear-gradient(135deg, var(--primary), var(--inverse-primary))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>Your Classroom</span>.
        </h1>

        <p style={{
          fontSize: '18px', color: 'var(--on-surface-variant)', maxWidth: '600px',
          lineHeight: 1.7, marginBottom: '48px',
        }}>
          Orchestrate high-fidelity learning experiences with real-time student comprehension monitoring.
        </p>

        <div style={{ display: 'flex', gap: '16px', marginBottom: '80px' }}>
          <button onClick={handleAuth} className="ct-btn-primary" style={{
            padding: '16px 32px', fontSize: '16px', borderRadius: '50px',
          }}>Launch Live Classroom</button>
          <button className="ct-btn-outline" style={{
            padding: '16px 32px', fontSize: '16px', borderRadius: '50px',
          }}>Watch Demo</button>
        </div>

        {/* Dashboard Preview Card */}
        <div className="ct-card" style={{
          width: '100%', maxWidth: '900px',
          borderRadius: '24px', padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(26, 92, 59, 0.02), transparent, rgba(59, 130, 246, 0.02))', pointerEvents: 'none' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', position: 'relative' }}>
            {/* Chart Area */}
            <div style={{ backgroundColor: 'var(--surface-container)', borderRadius: '16px', padding: '24px', height: '200px', position: 'relative' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--on-surface-variant)', marginBottom: '8px', fontWeight: 600 }}>CLASS PERFORMANCE</div>
              <svg width="100%" height="140" viewBox="0 0 400 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="previewGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(26, 92, 59, 0.25)" /><stop offset="100%" stopColor="rgba(26, 92, 59, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,80 Q50,60 100,50 T200,40 T300,30 T400,20 L400,100 L0,100 Z" fill="url(#previewGrad)" />
                <path d="M0,80 Q50,60 100,50 T200,40 T300,30 T400,20" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            {/* Sidebar Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ backgroundColor: 'var(--surface-container)', borderRadius: '16px', padding: '16px', flex: 1 }}>
                <div style={{ fontSize: '10px', color: 'var(--on-surface-variant)', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI INSIGHT</div>
                <div style={{ fontSize: '13px', color: 'var(--primary)', fontWeight: 500, lineHeight: 1.5 }}>3 students struggling with 'Quadratic Roots'. Trigger visual scaffold B.</div>
              </div>
              <div style={{
                backgroundColor: 'var(--primary-light)', borderRadius: '16px', padding: '12px',
                display: 'flex', alignItems: 'center', gap: '8px',
                border: '1px solid rgba(26, 92, 59, 0.1)',
              }}>
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: '18px' }}>sensors</span>
                <span style={{ fontSize: '12px', color: 'var(--primary)', fontWeight: 600 }}>Trusted by Innovation Hubs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ─── */}
      <section id="features" style={{ padding: '80px 40px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--primary)', fontWeight: 700, marginBottom: '12px' }}>FEATURES</p>
          <h2 className="font-headline" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--on-surface)' }}>
            Everything you need to teach smarter
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="ct-card"
              style={{
                position: 'relative',
                borderRadius: '24px',
                padding: '32px',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                transform: hoveredFeature === i ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredFeature === i ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px',
                  backgroundColor: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '20px',
                }}>
                  <span className="material-symbols-outlined filled" style={{ color: f.color, fontSize: '22px' }}>{f.icon}</span>
                </div>
                <h3 className="font-headline" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px', color: 'var(--on-surface)' }}>{f.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)', lineHeight: 1.7 }}>{f.desc}</p>
                {f.illustration && (
                  <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '56px', color: 'var(--outline-variant)' }}>{f.illustration}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section style={{
        margin: '0 40px 80px',
        borderRadius: '32px',
        padding: '80px 40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--inverse-primary) 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="font-headline" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', color: '#fff' }}>Connect your classroom today.</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '32px', maxWidth: '600px', margin: '0 auto 32px', lineHeight: 1.7 }}>
            Join over 2,500 educators redefining the limits of classroom intelligence. Experience the future of pedagogy.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={handleAuth} style={{
              padding: '14px 28px',
              background: '#fff', color: 'var(--primary)', fontWeight: 700, borderRadius: '50px',
              border: 'none', cursor: 'pointer', fontSize: '15px',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
              transition: 'all 0.25s',
            }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)' }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)' }}
            >Start Your Free Trial</button>
            <button style={{
              padding: '14px 28px',
              backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff',
              fontWeight: 700, borderRadius: '50px', border: '1px solid rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '15px',
              backdropFilter: 'blur(10px)', transition: 'all 0.25s',
            }}
              onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
              onMouseOut={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
            >Schedule a Demo</button>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid var(--outline)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontSize: '12px', color: 'var(--on-surface-variant)',
      }}>
        <div>
          <p style={{ fontWeight: 700, color: 'var(--on-surface)' }}>ClassTwin</p>
          <p style={{ opacity: 0.6, marginTop: '2px' }}>© 2025 ClassTwin. AI-Powered Excellence.</p>
        </div>
        <div style={{ display: 'flex', gap: '24px' }}>
          {['Twitter', 'LinkedIn', 'Status', 'Security', 'Privacy'].map(link => (
            <a
              key={link} href="#"
              style={{ color: 'var(--on-surface-variant)', fontSize: '12px', transition: 'color 0.2s' }}
              onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
              onMouseOut={e => e.currentTarget.style.color = 'var(--on-surface-variant)'}
            >{link}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
