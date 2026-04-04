import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ onStartSession }) {
  const navigate = useNavigate();
  
  const navItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/sessions' },
    { icon: 'school', label: 'Active Class', path: '/dashboard' },
    { icon: 'book_5', label: 'Materials', path: '/sessions', filled: true },
    { icon: 'analytics', label: 'Insights', path: '/analytics' },
    { icon: 'support_agent', label: 'Support', path: '#' },
  ];

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '288px',
      minWidth: '288px',
      borderRight: '1px solid rgba(224, 226, 234, 0.1)',
      backgroundColor: '#101419',
      padding: '24px',
      gap: '32px',
      position: 'relative',
      zIndex: 20,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '12px',
          background: 'linear-gradient(to bottom right, var(--primary), var(--inverse-primary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(192, 193, 255, 0.2)',
        }}>
          <span className="material-symbols-outlined filled" style={{ color: 'var(--on-primary-fixed)', fontSize: '20px' }}>auto_awesome</span>
        </div>
        <div>
          <h1 className="font-headline" style={{ fontSize: '20px', fontWeight: 900, color: '#e0e2ea', letterSpacing: '-0.02em' }}>ClassTwin AI</h1>
          <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', fontWeight: 700 }}>The Refractive Oracle</p>
        </div>
      </div>

      {/* Start Session Button */}
      <button
        onClick={onStartSession}
        style={{
          width: '100%',
          padding: '12px',
          background: 'linear-gradient(to right, var(--primary), var(--inverse-primary))',
          color: 'var(--on-primary-fixed)',
          fontWeight: 700,
          borderRadius: '12px',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 20px rgba(192, 193, 255, 0.1)',
          transition: 'all 0.2s',
          fontSize: '14px',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        Start Session
      </button>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              transition: 'all 0.2s',
              color: isActive ? 'var(--primary-fixed-dim)' : 'rgba(224, 226, 234, 0.5)',
              backgroundColor: isActive ? 'var(--surface-container)' : 'transparent',
              borderLeft: isActive ? '4px solid var(--secondary)' : '4px solid transparent',
              fontWeight: 500,
              fontSize: '14px',
              textDecoration: 'none',
            })}
          >
            <span className={`material-symbols-outlined ${item.filled ? 'filled' : ''}`} style={{ fontSize: '20px' }}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ paddingTop: '24px', borderTop: '1px solid rgba(70, 69, 84, 0.1)' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          color: 'rgba(224, 226, 234, 0.5)',
          cursor: 'pointer',
          transition: 'color 0.2s',
          fontSize: '14px',
        }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--error)'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(224, 226, 234, 0.5)'}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>logout</span>
          <span style={{ fontWeight: 500 }}>Log Out</span>
        </div>
      </div>
    </aside>
  );
}
