import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { BADGES } from '../utils/gamification';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1a1a2e', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 8, padding: '8px 12px', fontSize: '0.8rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>{label}</p>
        <p style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

export default function Analytics() {
  const { tasks, profile, fps } = useApp();

  // Subject-wise breakdown
  const subjects = profile?.subjects || [];
  const subjectData = subjects.map(sub => ({
    name: sub.length > 6 ? sub.slice(0, 6) : sub,
    fullName: sub,
    total:     tasks.filter(t => t.subject === sub).length,
    completed: tasks.filter(t => t.subject === sub && t.completed).length,
  }));

  // Weak subject = lowest completion rate
  const withRate = subjectData.filter(s => s.total > 0).map(s => ({
    ...s, rate: s.total > 0 ? Math.round((s.completed / s.total) * 100) : 0
  }));
  const weakSubject = withRate.length > 0 ? withRate.reduce((a, b) => a.rate < b.rate ? a : b) : null;

  // Weekly mock data (using today's real data)
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const todayIdx = new Date().getDay(); // 0=Sun
  const weekData = days.map((d, i) => ({
    day: d,
    tasks: i === (todayIdx === 0 ? 6 : todayIdx - 1) ? tasks.filter(t => t.completed).length : Math.floor(Math.random() * 5),
  }));

  const earnedBadges = (profile?.badges || []);
  const completionRate = tasks.length > 0 ? Math.round((tasks.filter(t=>t.completed).length / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">📊 Progress</h1>
          <p className="page-subtitle">Your academic performance overview</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid-2 mb-md">
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value text-gradient">{profile?.totalCompleted || 0}</div>
          <div className="stat-label">Total Done</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💎</div>
          <div className="stat-value" style={{ color: 'var(--accent-gold)' }}>{profile?.perfectDays || 0}</div>
          <div className="stat-label">Perfect Days</div>
        </div>
      </div>

      {/* FPS Overview */}
      <div className="chart-card mb-md">
        <div className="chart-title">⚡ Focus Performance Score</div>
        <div className="flex items-center gap-lg">
          <div style={{ fontSize: '3rem', fontWeight: 900, fontFamily: 'var(--font-mono)', color: fps >= 80 ? 'var(--accent-green)' : fps >= 50 ? 'var(--accent-primary)' : 'var(--accent-secondary)' }}>
            {fps}%
          </div>
          <div className="flex-1">
            <div className="progress-bar" style={{ height: 16, marginBottom: 8 }}>
              <div className="progress-fill" style={{ width: `${fps}%`, background: fps >= 80 ? 'var(--grad-green)' : fps >= 50 ? 'var(--grad-primary)' : 'var(--grad-danger)' }} />
            </div>
            <div className="text-xs text-muted">
              {fps >= 80 ? '🔥 Excellent! Keep it up!' : fps >= 50 ? '💪 Good progress!' : '⚡ Let\'s push harder!'}
            </div>
          </div>
        </div>
        <div className="mt-md">
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${completionRate}%` }} />
          </div>
          <div className="flex justify-between mt-xs">
            <span className="text-xs text-muted">Today's Completion</span>
            <span className="text-xs font-bold text-gradient">{completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Weak Subject Highlight */}
      {weakSubject && weakSubject.rate < 70 && (
        <div className="weak-subject-card mb-md">
          <div className="flex items-center gap-sm mb-xs">
            <span style={{ fontSize: '1.2rem' }}>⚠️</span>
            <span className="font-bold" style={{ color: 'var(--accent-secondary)' }}>Weak Subject Alert</span>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--text-primary)' }}>{weakSubject.fullName}</strong> needs attention — only {weakSubject.rate}% completion rate.
            Spend more time on this subject!
          </div>
        </div>
      )}

      {/* Subject Chart */}
      {subjectData.filter(s => s.total > 0).length > 0 && (
        <div className="chart-card mb-md">
          <div className="chart-title">📚 Subject-wise Tasks</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={subjectData.filter(s => s.total > 0)} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <XAxis dataKey="name" tick={{ fill: 'rgba(240,240,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(240,240,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(108,99,255,0.1)' }} />
              <Bar dataKey="completed" fill="#6c63ff" radius={[4,4,0,0]} name="Completed" />
              <Bar dataKey="total" fill="rgba(108,99,255,0.25)" radius={[4,4,0,0]} name="Total" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-md justify-center mt-sm">
            <span className="flex items-center gap-xs text-xs text-muted"><span style={{ width: 10, height: 10, background: '#6c63ff', borderRadius: 2, display: 'inline-block' }} /> Completed</span>
            <span className="flex items-center gap-xs text-xs text-muted"><span style={{ width: 10, height: 10, background: 'rgba(108,99,255,0.25)', borderRadius: 2, display: 'inline-block' }} /> Total</span>
          </div>
        </div>
      )}

      {/* Weekly Activity */}
      <div className="chart-card mb-md">
        <div className="chart-title">📅 Weekly Activity</div>
        <ResponsiveContainer width="100%" height={140}>
          <LineChart data={weekData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="day" tick={{ fill: 'rgba(240,240,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(240,240,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(108,99,255,0.4)', borderRadius: 8, fontSize: '0.8rem' }} />
            <Line type="monotone" dataKey="tasks" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', r: 4 }} activeDot={{ r: 6, fill: '#bd93f9' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Badges */}
      <div className="chart-card">
        <div className="chart-title">🏅 Badges</div>
        <div className="badges-grid">
          {BADGES.map(badge => {
            const isEarned = earnedBadges.includes(badge.id);
            return (
              <div key={badge.id} className={`badge-card${isEarned ? ' earned' : ' locked'}`} title={badge.desc}>
                <div className="badge-emoji">{badge.emoji}</div>
                <div className="badge-name">{badge.name}</div>
                {isEarned && <div style={{ fontSize: '0.6rem', color: 'var(--accent-gold)', marginTop: 2 }}>EARNED</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
