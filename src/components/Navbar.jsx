import React from 'react';
import { useApp } from '../context/AppContext';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '🏠', label: 'Home' },
  { id: 'missions',  icon: '🎯', label: 'Missions' },
  { id: 'analytics', icon: '📊', label: 'Progress' },
  { id: 'tutor',     icon: '🤖', label: 'AI Tutor' },
  { id: 'profile',   icon: '👤', label: 'Profile' },
];

export default function Navbar({ active, onNavigate }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          id={`nav-${item.id}`}
          className={`nav-item${active === item.id ? ' active' : ''}`}
          onClick={() => onNavigate(item.id)}
          aria-label={item.label}
          aria-current={active === item.id ? 'page' : undefined}
        >
          <span className="nav-icon">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
