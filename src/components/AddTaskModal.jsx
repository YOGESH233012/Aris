import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';

const SUBJECTS = ['Math','Science','English','History','Geography','Physics','Chemistry','Biology','Hindi','Computer'];
const PRIORITIES = ['low','medium','high'];

export default function AddTaskModal({ onClose }) {
  const { addTask, profile } = useApp();
  const [form, setForm] = useState({
    name: '', subject: profile?.subjects?.[0] || 'Math',
    time: '08:00', priority: 'medium',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    await addTask(form);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">🎯 New Mission</h2>
          <button id="modal-close" onClick={onClose} className="btn btn-secondary btn-icon">✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="task-name">Mission Name</label>
            <input id="task-name" type="text" className="input-field"
              placeholder="e.g., Solve 10 math problems"
              value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              autoFocus />
          </div>
          <div className="input-group">
            <label htmlFor="task-subject">Subject</label>
            <select id="task-subject" className="input-field"
              value={form.subject} onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}>
              {(profile?.subjects?.length ? profile.subjects : SUBJECTS).map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="task-time">Study Time</label>
            <input id="task-time" type="time" className="input-field"
              value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} />
          </div>
          <div className="input-group">
            <label>Priority</label>
            <div className="flex gap-sm">
              {PRIORITIES.map(p => (
                <button key={p} type="button"
                  className={`btn btn-sm flex-1${form.priority === p ? ' btn-primary' : ' btn-secondary'}`}
                  onClick={() => setForm(prev => ({ ...prev, priority: p }))}>
                  {p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'} {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-md mt-lg">
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button id="submit-task" type="submit" className="btn btn-primary flex-1">🚀 Add Mission</button>
          </div>
        </form>
      </div>
    </div>
  );
}
