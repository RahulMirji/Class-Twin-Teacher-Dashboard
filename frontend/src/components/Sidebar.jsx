import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar({ onStartSession }) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const menuItems = [
    { icon: 'space_dashboard', label: 'Dashboard', path: '/sessions', badge: null, end: true },
    { icon: 'groups', label: 'Students', path: '/students', badge: null, end: true },
    { icon: 'auto_stories', label: 'Materials', path: '/materials', badge: null, end: true },
    { icon: 'monitoring', label: 'Insights', path: '/analytics', badge: '3', end: true },
    { icon: 'smart_toy', label: 'AI Tutor', path: '/ai-tutor', badge: 'NEW', end: true },
  ];

  const generalItems = [
    { icon: 'settings', label: 'Settings', path: '#' },
    { icon: 'help', label: 'Help Center', path: '#' },
    { icon: 'logout', label: 'Logout', path: '#', isLogout: true },
  ];

  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Teacher';

  const renderNavItem = (item) => {
    const isHovered = hoveredItem === item.label;
    const baseStyle = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 14px',
      borderRadius: '10px',
      transition: 'all 0.15s ease',
      fontSize: '14px',
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      color: isHovered ? '#1F2937' : '#6B7280',
      background: isHovered ? '#F9FAFB' : 'transparent',
      position: 'relative',
    };

    if (item.isLogout) {
      return (
        <div
          key={item.label}
          onClick={handleLogout}
          onMouseEnter={() => setHoveredItem(item.label)}
          onMouseLeave={() => setHoveredItem(null)}
          style={{ ...baseStyle, color: isHovered ? '#EF4444' : '#9CA3AF', background: isHovered ? '#FEF2F2' : 'transparent' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit' }}>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      );
    }

    return (
      <NavLink
        key={item.label}
        to={item.path}
        end={item.end}
        onMouseEnter={() => setHoveredItem(item.label)}
        onMouseLeave={() => setHoveredItem(null)}
        className={({ isActive }) => isActive ? 'nav-active' : ''}
        style={({ isActive }) => ({
          ...baseStyle,
          color: isActive ? '#1A5C3B' : isHovered ? '#1F2937' : '#6B7280',
          background: isActive ? 'rgba(26, 92, 59, 0.07)' : isHovered ? '#F9FAFB' : 'transparent',
          fontWeight: isActive ? 600 : 500,
        })}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'inherit', transition: 'all 0.15s' }}>
          {item.icon}
        </span>
        <span style={{ flex: 1 }}>{item.label}</span>
        {item.badge && (
          <span style={{
            padding: '2px 8px',
            borderRadius: '20px',
            fontSize: '10px',
            fontWeight: 700,
            ...(item.badge === 'NEW'
              ? { background: '#E8F5EE', color: '#1A5C3B' }
              : { background: '#F3F4F6', color: '#374151' }
            ),
          }}>
            {item.badge}
          </span>
        )}
      </NavLink>
    );
  };

  return (
    <aside style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '240px',
      minWidth: '240px',
      background: '#FFFFFF',
      borderRight: '1px solid #EAECF0',
      padding: '20px 12px',
      gap: '2px',
      position: 'relative',
      zIndex: 20,
      overflowY: 'auto',
    }}>

      {/* Logo */}
      <div style={{ padding: '4px 8px 20px 8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px', height: '36px', minWidth: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1A5C3B, #2D7A52)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(26, 92, 59, 0.25)',
        }}>
          <span className="material-symbols-outlined filled" style={{ color: '#fff', fontSize: '20px' }}>neurology</span>
        </div>
        <div>
          <h1 className="font-headline" style={{ fontSize: '16px', fontWeight: 800, color: '#111827', letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            ClassTwin
          </h1>
          <p style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#9CA3AF', fontWeight: 600, marginTop: '1px' }}>
            AI Teaching Engine
          </p>
        </div>
      </div>

      {/* MENU section */}
      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF', fontWeight: 700, padding: '4px 14px 6px' }}>
        Menu
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {menuItems.map(renderNavItem)}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1, minHeight: '20px' }} />

      {/* GENERAL section */}
      <div style={{ borderTop: '1px solid #EAECF0', paddingTop: '12px' }}>
        <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#9CA3AF', fontWeight: 700, padding: '4px 14px 6px' }}>
          General
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {generalItems.map(renderNavItem)}
        </div>
      </div>

      {/* User profile */}
      {user && (
        <div style={{
          marginTop: '12px',
          padding: '12px',
          borderRadius: '12px',
          background: '#F9FAFB',
          border: '1px solid #EAECF0',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          {user.user_metadata?.avatar_url ? (
            <img src={user.user_metadata.avatar_url} alt="" style={{ width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%', border: '2px solid #EAECF0' }} />
          ) : (
            <div style={{
              width: '32px', height: '32px', minWidth: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #1A5C3B, #2D7A52)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#fff',
            }}>
              {displayName[0]?.toUpperCase()}
            </div>
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {displayName}
            </p>
            <p style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.email}
            </p>
          </div>
        </div>
      )}

      {/* Mobile app promo card */}
      <div style={{
        marginTop: '12px',
        borderRadius: '14px',
        background: 'linear-gradient(135deg, #1A5C3B 0%, #0f3d26 100%)',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '80px', height: '80px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
        }} />
        <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', lineHeight: 1.4, marginBottom: '4px' }}>
          Download our<br /><span style={{ color: '#4DE89A' }}>Mobile App</span>
        </p>
        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', marginBottom: '12px', lineHeight: 1.5 }}>
          Students join your class in real-time
        </p>
        <button style={{
          width: '100%', padding: '7px 0',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: '8px', color: '#fff',
          fontSize: '11px', fontWeight: 700,
          cursor: 'pointer', backdropFilter: 'blur(4px)',
        }}>
          Download
        </button>
      </div>
    </aside>
  );
}
