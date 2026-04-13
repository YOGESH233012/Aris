import React from 'react';
import { useApp } from '../context/AppContext';
import { getMotivationMessage, getTimeGreeting } from '../utils/motivation';
import XPBar from '../components/XPBar';
import FPSRing from '../components/FPSRing';

export default function Dashboard({ onNavigate }) {
  const { profile, tasks, fps, completedToday, totalToday } = useApp();

  const motivation = getMotivationMessage({
    tasksToday: totalToday,
    completedToday,
    streak: profile?.streak || 0,
    lastActivityHours: 0,
  });

  const recentTasks = tasks.slice(0, 3);
  const progressPct = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div className="text-sm text-secondary mb-xs">{getTimeGreeting()}, student! 👋</div>
        <div className="welcome-name text-gradient">{profile?.name || 'Student'}</div>
        <div className="welcome-meta">📚 Class {profile?.cls} · {profile?.school || 'ARIS Academy'}</div>
        <div className="flex gap-sm mt-md flex-wrap">
          {(profile?.subjects || []).slice(0, 3).map(s => (
            <span key={s} className="badge badge-primary">{s}</span>
          ))}
          {(profile?.subjects || []).length > 3 && (
            <span className="badge badge-primary">+{(profile.subjects.length - 3)} more</span>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value text-gold">{profile?.xp || 0}</div>
          <div className="stat-label">XP Points</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{profile?.streak || 0}</div>
          <div className="stat-label">Day Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-value" style={{ color: 'var(--accent-cyan)' }}>{fps}%</div>
          <div className="stat-label">FPS Score</div>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar xp={profile?.xp || 0} />

      {/* Motivation Card */}
      <div className="motivation-card" style={{ background: motivation.bg, borderColor: motivation.border, color: motivation.color }}>
        {motivation.msg}
      </div>

      {/* Today's Progress */}
      <div className="card mb-md">
        <div className="flex justify-between items-center mb-md">
          <div className="section-title" style={{ marginBottom: 0 }}>📋 Today's Progress</div>
          <div className="flex gap-xs items-center">
            <span className="font-mono font-bold" style={{ color: 'var(--accent-green)' }}>{completedToday}</span>
            <span className="text-muted text-sm">/ {totalToday} done</span>
          </div>
        </div>
        <div className="progress-bar" style={{ height: 12 }}>
          <div className="progress-fill green" style={{ width: `${progressPct}%` }} />
        </div>
        <div className="flex justify-between mt-xs">
          <span className="text-xs text-muted">0%</span>
          <span className="text-xs font-bold" style={{ color: 'var(--accent-green)' }}>{progressPct}% Complete</span>
          <span className="text-xs text-muted">100%</span>
        </div>
      </div>

      {/* FPS + Quick Actions */}
      <div className="grid-2 mb-md">
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FPSRing fps={fps} />
        </div>
        <div className="flex flex-col gap-sm">
          <button id="dash-go-missions" className="btn btn-primary" style={{ flex: 1 }} onClick={() => onNavigate('missions')}>
            🎯 Missions
          </button>
          <button id="dash-go-tutor" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onNavigate('tutor')}>
            🤖 Ask AI
          </button>
          <button id="dash-go-analytics" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onNavigate('analytics')}>
            📊 Progress
          </button>
        </div>
      </div>

      {/* Recent Tasks */}
      {recentTasks.length > 0 && (
        <div>
          <div className="section-title">⚡ Today's Missions</div>
          {recentTasks.map(task => (
            <div key={task.id} className={`task-card priority-${task.priority || 'medium'}${task.completed ? ' completed' : ''}`}>
              <div className={`task-check${task.completed ? ' done' : ''}`}>
                {task.completed ? '✓' : ''}
              </div>
              <div className="task-info">
                <div className="task-name">{task.name}</div>
                <div className="task-meta">
                  <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '0.7rem' }}>{task.subject}</span>
                  <span>⏰ {task.time}</span>
                </div>
              </div>
              {task.completed && <span style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}>✅</span>}
            </div>
          ))}
          {tasks.length > 3 && (
            <button className="btn btn-secondary btn-full btn-sm" onClick={() => onNavigate('missions')}>
              View all {tasks.length} missions →
            </button>
          )}
        </div>
      )}

      {/* No tasks empty state */}
      {tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <div className="empty-state-title">No missions yet!</div>
          <div className="empty-state-desc">Create your first study mission to start earning XP.</div>
          <button id="dash-create-first" className="btn btn-primary" onClick={() => onNavigate('missions')}>
            + Create Mission
          </button>
        </div>
      )}
    </div>
  );
}
