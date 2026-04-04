import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const { signInWithGoogle, user, loading } = useAuth();
  const navigate = useNavigate();
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      navigate('/sessions', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      setError('Failed to sign in. Please try again.');
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: 'var(--background)', color: 'var(--on-surface)',
      }}>
        <div className="loading-pulse" style={{ fontSize: '18px', opacity: 0.6 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'var(--background)', color: 'var(--on-surface)',
      fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glows */}
      <div style={{
        position: 'absolute', top: '-20%', left: '10%',
        width: '600px', height: '600px',
        background: 'rgba(128, 131, 255, 0.08)', filter: 'blur(120px)', borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', bottom: '-15%', right: '15%',
        width: '500px', height: '500px',
        background: 'rgba(74, 225, 118, 0.05)', filter: 'blur(100px)', borderRadius: '50%',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        maxWidth: '440px', width: '100%', padding: '0 24px',
      }}>
        {/* Logo */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '18px',
          background: 'linear-gradient(to bottom right, var(--primary), var(--inverse-primary))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(192, 193, 255, 0.25)',
          marginBottom: '24px',
        }}>
          <span className="material-symbols-outlined filled" style={{
            color: 'var(--on-primary-fixed)', fontSize: '30px',
          }}>auto_awesome</span>
        </div>

        <h1 className="font-headline" style={{
          fontSize: '32px', fontWeight: 800, letterSpacing: '-0.02em',
          marginBottom: '8px', textAlign: 'center',
        }}>Welcome to ClassTwin</h1>

        <p style={{
          fontSize: '15px', color: 'var(--on-surface-variant)',
          lineHeight: 1.6, textAlign: 'center', marginBottom: '40px',
        }}>
          Sign in to access your teacher dashboard and create live classroom sessions.
        </p>

        {/* Login Card */}
        <div style={{
          width: '100%',
          backgroundColor: 'var(--surface-container-low)',
          borderRadius: '24px', padding: '32px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        }}>
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            style={{
              width: '100%', padding: '14px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              backgroundColor: 'var(--surface-container-highest)',
              color: 'var(--on-surface)',
              fontWeight: 600, fontSize: '15px',
              borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)',
              cursor: signingIn ? 'not-allowed' : 'pointer',
              opacity: signingIn ? 0.6 : 1,
              transition: 'all 0.3s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseOver={e => { if (!signingIn) e.currentTarget.style.backgroundColor = 'var(--surface-container)'; }}
            onMouseOut={e => { e.currentTarget.style.backgroundColor = 'var(--surface-container-highest)'; }}
          >
            {/* Google "G" icon */}
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {signingIn ? 'Signing in...' : 'Continue with Google'}
          </button>

          {error && (
            <p style={{
              marginTop: '16px', color: 'var(--error)',
              fontSize: '13px', textAlign: 'center',
            }}>{error}</p>
          )}

          <div style={{
            marginTop: '24px', paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', opacity: 0.5 }}>
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

        <p style={{
          marginTop: '24px', fontSize: '13px',
          color: 'var(--on-surface-variant)', opacity: 0.4,
        }}>
          Teacher Dashboard • Powered by AI
        </p>
      </div>
    </div>
  );
}
