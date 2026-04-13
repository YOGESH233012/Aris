import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import AddTaskModal from '../components/AddTaskModal';
import confetti from 'canvas-confetti';

const FILTERS = ['All', 'Pending', 'Done'];

function fireConfetti() {
  confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 },
    colors: ['#6c63ff','#bd93f9','#00e676','#ffd700','#ff6584'] });
}

export default function Missions() {
  const { tasks, completeTask, deleteTask, profile } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter]       = useState('All');
  const [deleting, setDeleting]   = useState(null);

  const filtered = tasks.filter(t => {
    if (filter === 'Pending') return !t.completed;
    if (filter === 'Done')    return t.completed;
    return true;
  });

  const handleComplete = async (id) => {
    await completeTask(id);
    fireConfetti();
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    setTimeout(async () => { await deleteTask(id); setDeleting(null); }, 300);
  };

  const priorityColors = { high: 'var(--accent-secondary)', medium: 'var(--accent-orange)', low: 'var(--accent-green)' };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title text-gradient">🎯 Missions</h1>
          <p className="page-subtitle">{tasks.filter(t=>t.completed).length}/{tasks.length} completed today</p>
        </div>
        <button id="btn-add-task" className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>
          + New
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {FILTERS.map(f => (
          <button key={f} className={`filter-tab${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}>
            {f} {f === 'All' ? `(${tasks.length})` : f === 'Pending' ? `(${tasks.filter(t=>!t.completed).length})` : `(${tasks.filter(t=>t.completed).length})`}
          </button>
        ))}
      </div>

      {/* Task List */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">{filter === 'Done' ? '🎉' : '📋'}</div>
          <div className="empty-state-title">
            {filter === 'Done' ? 'No completed missions yet' : 'No missions here'}
          </div>
          <div className="empty-state-desc">
            {filter === 'Pending' ? 'All done! Great work! 🎉' : 'Tap "+ New" to create your first mission.'}
          </div>
          {filter === 'All' && (
            <button id="empty-add-task" className="btn btn-primary" onClick={() => setShowModal(true)}>
              🚀 Create First Mission
            </button>
          )}
        </div>
      ) : (
        <div>
          {filtered.map((task, i) => (
            <div
              key={task.id}
              className={`task-card priority-${task.priority || 'medium'}${task.completed ? ' completed' : ''}${deleting===task.id ? ' animate-scaleIn' : ''}`}
              style={{ animationDelay: `${i * 0.05}s`, opacity: deleting === task.id ? 0 : 1, transition: 'opacity 0.3s ease' }}
            >
              {/* Complete Button */}
              <button
                id={`complete-${task.id}`}
                className={`task-check${task.completed ? ' done' : ''}`}
                onClick={() => !task.completed && handleComplete(task.id)}
                disabled={task.completed}
                aria-label={task.completed ? 'Completed' : 'Mark as complete'}
              >
                {task.completed ? '✓' : ''}
              </button>

              {/* Info */}
              <div className="task-info">
                <div className="task-name">{task.name}</div>
                <div className="task-meta">
                  <span className="badge badge-primary" style={{ fontSize: '0.7rem', padding: '2px 8px' }}>
                    {task.subject}
                  </span>
                  <span>⏰ {task.time}</span>
                  <span style={{ color: priorityColors[task.priority||'medium'], fontSize: '0.7rem', fontWeight: 700 }}>
                    {(task.priority||'medium').toUpperCase()}
                  </span>
                </div>
              </div>

              {/* XP Badge */}
              <div className="flex flex-col items-center gap-xs">
                {task.completed
                  ? <span style={{ color: 'var(--accent-green)', fontSize: '1.2rem' }}>✅</span>
                  : <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>+50 XP</span>
                }
                <button
                  id={`delete-${task.id}`}
                  className="btn btn-icon"
                  style={{ width: 28, height: 28, background: 'rgba(255,101,132,0.1)', fontSize: '0.7rem', borderRadius: 6 }}
                  onClick={() => handleDelete(task.id)}
                  aria-label="Delete task"
                >🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* FAB */}
      <button id="fab-add-task" className="fab" onClick={() => setShowModal(true)} aria-label="Add new mission">
        +
      </button>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
