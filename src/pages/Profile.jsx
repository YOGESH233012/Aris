import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getLevel, BADGES } from '../utils/gamification';
import XPBar from '../components/XPBar';

const SUBJECTS = ['Math','Science','English','History','Geography','Physics','Chemistry','Biology','Hindi','Computer'];
const CLASSES  = ['6th','7th','8th','9th','10th','11th','12th'];

export default function Profile() {
  const { profile, logout, updateProfile, toast } = useApp();
  const [editing, setEditing]   = useState(false);
  const [form, setForm]         = useState({
    name: profile?.name || '',
    school: profile?.school || '',
    cls: profile?.cls || '10th',
    subjects: profile?.subjects || [],
  });

  const level = getLevel(profile?.xp || 0);
  const initials = (profile?.name || 'U').slice(0, 2).toUpperCase();
  const earnedBadges = profile?.badges || [];

  const toggleSubject = (s) =>
    setForm(p => ({
      ...p,
      subjects: p.subjects.includes(s) ? p.subjects.filter(x => x !== s) : [...p.subjects, s]
    }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast('⚠️ Name cannot be empty'); return; }
    await updateProfile(form);
    setEditing(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">👤 Profile</h1>
          <p className="page-subtitle">Your ARIS identity</p>
        </div>
        <button id="btn-logout" className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
      </div>

      {/* Avatar */}
      <div className="profile-avatar">{initials}</div>
      <div className="profile-name">{profile?.name}</div>
      <div className="profile-level">
        {level.emoji} {level.name} · Class {profile?.cls} · {profile?.school || 'ARIS Academy'}
      </div>

      <div className="divider" />

      {/* Stats */}
      <div className="stats-row mb-md">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-value text-gold">{profile?.xp || 0}</div>
          <div className="stat-label">Total XP</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-value" style={{ color: 'var(--accent-orange)' }}>{profile?.streak || 0}</div>
          <div className="stat-label">Streak</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value" style={{ color: 'var(--accent-green)' }}>{profile?.totalCompleted || 0}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      {/* XP Bar */}
      <XPBar xp={profile?.xp || 0} />

      {/* Badges earned */}
      {earnedBadges.length > 0 && (
        <div className="chart-card mb-md">
          <div className="chart-title">🏅 My Badges ({earnedBadges.length})</div>
          <div className="flex flex-wrap gap-sm">
            {BADGES.filter(b => earnedBadges.includes(b.id)).map(b => (
              <div key={b.id} title={b.desc}
                style={{ textAlign: 'center', padding: '8px 12px', background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)', borderRadius: 12 }}>
                <div style={{ fontSize: '1.5rem' }}>{b.emoji}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', fontWeight: 600, marginTop: 2 }}>{b.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile */}
      {editing ? (
        <div className="card mb-md animate-fadeInUp">
          <div className="modal-title mb-md">✏️ Edit Profile</div>
          <div className="input-group">
            <label htmlFor="profile-name">Name</label>
            <input id="profile-name" type="text" className="input-field"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </div>
          <div className="input-group">
            <label htmlFor="profile-school">School</label>
            <input id="profile-school" type="text" className="input-field"
              value={form.school} onChange={e => setForm(p => ({ ...p, school: e.target.value }))} />
          </div>
          <div className="input-group">
            <label htmlFor="profile-class">Class</label>
            <select id="profile-class" className="input-field"
              value={form.cls} onChange={e => setForm(p => ({ ...p, cls: e.target.value }))}>
              {CLASSES.map(c => <option key={c} value={c}>{c} Grade</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>Subjects</label>
            <div className="subjects-grid">
              {SUBJECTS.map(s => (
                <button key={s} type="button"
                  className={`subject-pill${form.subjects.includes(s) ? ' selected' : ''}`}
                  onClick={() => toggleSubject(s)}>{s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-md mt-md">
            <button id="profile-cancel" className="btn btn-secondary flex-1" onClick={() => setEditing(false)}>Cancel</button>
            <button id="profile-save"   className="btn btn-primary flex-1"   onClick={handleSave}>💾 Save</button>
          </div>
        </div>
      ) : (
        <div className="card mb-md">
          <div className="chart-title mb-md">📚 My Subjects</div>
          <div className="flex flex-wrap gap-sm mb-lg">
            {(profile?.subjects || []).map(s => (
              <span key={s} className="badge badge-primary">{s}</span>
            ))}
            {!(profile?.subjects?.length) && <span className="text-muted text-sm">No subjects added</span>}
          </div>
          <button id="btn-edit-profile" className="btn btn-secondary btn-full" onClick={() => setEditing(true)}>
            ✏️ Edit Profile
          </button>
        </div>
      )}

      {/* About */}
      <div className="card" style={{ textAlign: 'center', opacity: 0.6 }}>
        <div className="text-gradient font-bold" style={{ fontSize: '1.2rem', marginBottom: 4 }}>ARIS</div>
        <div className="text-xs text-muted">Adaptive Routine Intelligence System</div>
        <div className="text-xs text-muted mt-xs">v1.0.0 · Study Planner · Game · AI Tutor</div>
      </div>
    </div>
  );
}
