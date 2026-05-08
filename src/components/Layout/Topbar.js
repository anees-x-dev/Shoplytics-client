import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import './Topbar.css';

const notifications = [
  { id:1, icon:'📦', text:'New order received from Sarah M.',           time:'2 min ago',   unread:true,  bg:'rgba(37,99,235,.1)'  },
  { id:2, icon:'✅', text:'Payment confirmed for Order #4821',           time:'15 min ago',  unread:true,  bg:'rgba(16,185,129,.1)' },
  { id:3, icon:'⚠️', text:'Low stock: Only 3 units left of Phone Case', time:'1 hour ago',  unread:false, bg:'rgba(245,158,11,.1)' },
  { id:4, icon:'👤', text:'5 new customers registered today',            time:'3 hours ago', unread:false, bg:'rgba(139,92,246,.1)' },
];

export default function Topbar({ onToggleSidebar, onOpenCmd }) {
  const { isDark, toggleDark } = useTheme();
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [notifItems, setNotifItems] = useState(notifications);
  const notifRef = useRef(null);

  useEffect(() => {
    const h = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const unreadCount = notifItems.filter(n => n.unread).length;

  const clearAll = () => {
    setNotifItems(prev => prev.map(n => ({ ...n, unread: false })));
    setNotifOpen(false);
  };

  return (
    <header className="topbar">

      {/* ── Left ── */}
      <div className="topbar-left">
        {/* Hamburger — always visible on mobile */}
        <button className="icon-btn hamburger" onClick={onToggleSidebar} title="Menu">
          <span className="ham-line" />
          <span className="ham-line" />
          <span className="ham-line" />
        </button>

        {/* Search bar */}
        <div className="search-wrap" onClick={onOpenCmd} role="button" tabIndex={0}>
          <span className="search-icon">🔍</span>
          <span className="search-fake">Search anything…</span>
          <span className="search-kbd">Ctrl K</span>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="topbar-right">

        {/* Export — hidden on xs */}
        <button className="icon-btn hide-xs" onClick={() => toast.success('⬇️ Export started!')} title="Export">
          ⬇️
        </button>

        {/* Notifications */}
        <div className="notif-wrap" ref={notifRef}>
          <button className="icon-btn" onClick={() => setNotifOpen(p => !p)} title="Notifications">
            🔔
            {unreadCount > 0 && <span className="notif-dot" />}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              <div className="notif-head">
                <strong>Notifications</strong>
                <button className="notif-clear" onClick={clearAll}>Clear all</button>
              </div>
              {notifItems.map(n => (
                <div key={n.id} className={`notif-item${n.unread ? ' unread' : ''}`}>
                  <div className="notif-icon-wrap" style={{ background: n.bg }}>{n.icon}</div>
                  <div className="notif-body">
                    <p className="notif-text">{n.text}</p>
                    <p className="notif-time">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dark mode toggle */}
        <button
          className={`dark-toggle${isDark ? ' on' : ''}`}
          onClick={toggleDark}
          title="Toggle dark mode"
          aria-label="Toggle dark mode"
        >
          <span className="toggle-knob">{isDark ? '🌙' : '☀️'}</span>
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" title="Profile">MK</div>
      </div>
    </header>
  );
}
