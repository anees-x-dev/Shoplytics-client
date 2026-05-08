import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Sidebar.css';

const navItems = [
  {
    label: 'Main',
    items: [
      { to: '/',          icon: '📊', text: 'Dashboard'     },
      { to: '/analytics', icon: '📈', text: 'Analytics'     },
    ],
  },
  {
    label: 'Management',
    items: [
      { to: '/orders',    icon: '📦', text: 'Orders',    badge: 12 },
      { to: '/products',  icon: '🛍️', text: 'Products'            },
      { to: '/customers', icon: '👥', text: 'Customers'           },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/support',  icon: '💬', text: 'Help & Support' },
      { to: '/settings', icon: '⚙️', text: 'Settings'       },
    ],
  },
];

export default function Sidebar({ collapsed, mobileOpen, onClose }) {
  const cls = [
    'sidebar',
    collapsed  ? 'collapsed'   : '',
    mobileOpen ? 'mobile-open' : '',
  ].filter(Boolean).join(' ');

  return (
    <aside className={cls}>

      {/* ── Logo area ── */}
      <div className="sidebar-logo">
        {/* Rounded square card — common in SaaS dashboards */}
        <div className="logo-card">
          <img src={logo} alt="Shoplytics" className="logo-img" />
        </div>
        <span className="logo-text">Shoplytics</span>
      </div>

      {/* ── Navigation ── */}
      <nav className="sidebar-nav">
        {navItems.map(section => (
          <div className="nav-section" key={section.label}>
            <span className="nav-label">{section.label}</span>
            {section.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={onClose}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.text}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── User footer ── */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">MK</div>
          <div className="user-info">
            <div className="user-name">Muhammad Anees</div>
            <div className="user-role">Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
