import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Geography', 'Physics', 'Chemistry', 'Biology', 'Hindi', 'Computer'];
const CLASSES  = ['6th','7th','8th','9th','10th','11th','12th'];

export default function Auth() {
  const { signup, login, toast } = useApp();
  const [tab, setTab]     = useState('login');
  const [loading, setLoading] = useState(false);

  // Login state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  // Signup state
  const [signupData, setSignupData] = useState({
    name: '', school: '', cls: '10th', email: '', password: '',
  });
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const toggleSubject = (s) =>
    setSelectedSubjects(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) { toast('⚠️ Fill all fields'); return; }
    setLoading(true);
    const res = await login(loginData.email, loginData.password);
    setLoading(false);
    if (!res.success) toast('❌ ' + (res.error || 'Login failed'));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!signupData.name || !signupData.email || !signupData.password) { toast('⚠️ Fill all fields'); return; }
    if (signupData.password.length < 6) { toast('⚠️ Password must be 6+ characters'); return; }
    if (selectedSubjects.length === 0) { toast('⚠️ Select at least one subject'); return; }
    setLoading(true);
    const res = await signup(signupData.email, signupData.password, {
      name: signupData.name,
      school: signupData.school,
      cls: signupData.cls,
      subjects: selectedSubjects,
    });
    setLoading(false);
    if (!res.success) toast('❌ ' + (res.error || 'Signup failed'));
  };

  return (
    <div className="auth-screen">
      {/* Logo */}
      <div className="auth-logo text-gradient">ARIS</div>
      <p className="auth-tagline">Adaptive Routine Intelligence System<br />
        <span style={{ color: 'var(--accent-cyan)', fontSize: '0.8rem' }}>Study Planner · Game · AI Assistant</span>
      </p>

      <div className="auth-card">
        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Login</button>
          <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => setTab('signup')}>Sign Up</button>
        </div>

        {/* Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" className="input-field" placeholder="your@email.com"
                value={loginData.email} onChange={e => setLoginData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="input-group">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" className="input-field" placeholder="••••••••"
                value={loginData.password} onChange={e => setLoginData(p => ({ ...p, password: e.target.value }))} />
            </div>
            <button id="btn-login" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Logging in...' : '🚀 Login to ARIS'}
            </button>
            <p className="text-center text-sm text-muted mt-md">
              New student? <button type="button" className="btn-link" onClick={() => setTab('signup')}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>
                Create Account
              </button>
            </p>
          </form>
        )}

        {/* Signup Form */}
        {tab === 'signup' && (
          <form onSubmit={handleSignup}>
            <div className="input-group">
              <label htmlFor="signup-name">Your Name</label>
              <input id="signup-name" type="text" className="input-field" placeholder="e.g., Ashutosh Kumar"
                value={signupData.name} onChange={e => setSignupData(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="input-group">
              <label htmlFor="signup-school">School Name</label>
              <input id="signup-school" type="text" className="input-field" placeholder="e.g., Delhi Public School"
                value={signupData.school} onChange={e => setSignupData(p => ({ ...p, school: e.target.value }))} />
            </div>
            <div className="input-group">
              <label htmlFor="signup-class">Class</label>
              <select id="signup-class" className="input-field"
                value={signupData.cls} onChange={e => setSignupData(p => ({ ...p, cls: e.target.value }))}>
                {CLASSES.map(c => <option key={c} value={c}>{c} Grade</option>)}
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" className="input-field" placeholder="your@email.com"
                value={signupData.email} onChange={e => setSignupData(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div className="input-group">
              <label htmlFor="signup-password">Password</label>
              <input id="signup-password" type="password" className="input-field" placeholder="6+ characters"
                value={signupData.password} onChange={e => setSignupData(p => ({ ...p, password: e.target.value }))} />
            </div>
            <div className="input-group">
              <label>Subjects (select all that apply)</label>
              <div className="subjects-grid">
                {SUBJECTS.map(s => (
                  <button key={s} type="button"
                    className={`subject-pill${selectedSubjects.includes(s) ? ' selected' : ''}`}
                    onClick={() => toggleSubject(s)}>{s}
                  </button>
                ))}
              </div>
            </div>
            <button id="btn-signup" type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '⏳ Creating...' : '🎓 Join ARIS'}
            </button>
          </form>
        )}
      </div>

      {/* Decorative stats */}
      <div className="flex gap-lg mt-lg" style={{ opacity: 0.5 }}>
        {['📚 Study', '🎮 Gamified', '🤖 AI Tutor'].map(item => (
          <span key={item} className="text-xs text-secondary">{item}</span>
        ))}
      </div>
    </div>
  );
}
