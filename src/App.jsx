import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Missions from './pages/Missions';
import Analytics from './pages/Analytics';
import AiTutor from './pages/AiTutor';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';

function AppShell() {
  const { user, profile, loading, toasts } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="loading-screen">
        <div style={{ fontSize: '3rem', fontWeight: 900 }} className="text-gradient">ARIS</div>
        <div className="spinner" />
        <p className="text-muted text-sm">Loading your universe...</p>
      </div>
    );
  }

  if (!user || !profile?.name) return <Auth />;

  const pages = {
    dashboard: <Dashboard onNavigate={setActiveTab} />,
    missions:  <Missions />,
    analytics: <Analytics />,
    tutor:     <AiTutor />,
    profile:   <Profile />,
  };

  return (
    <div className="app-layout">
      {/* Toast Notifications */}
      <div className="toast-container" aria-live="polite">
        {toasts.map(t => (
          <div key={t.id} className="toast">{t.msg}</div>
        ))}
      </div>

      {/* Main Content */}
      <main className="main-content" id="main-content">
        {pages[activeTab]}
      </main>

      {/* Bottom Nav */}
      <Navbar active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}

export default function App() {
  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <AppProvider>
        <AppShell />
      </AppProvider>
    </>
  );
}
