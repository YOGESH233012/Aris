import React, { useState, useRef, useEffect } from 'react';
import { getTutorResponse, QUICK_QUESTIONS } from '../utils/tutorLogic';

const WELCOME = {
  id: 'welcome', role: 'bot',
  text: "👋 Hey! I'm **ARIS AI Tutor**. I can help you with:\n📐 Math · 🔬 Science · 📝 English · 🏛️ History · 🌍 Geography\n\nAsk me any doubt and I'll explain it simply! 🎓"
};

export default function AiTutor() {
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput]       = useState('');
  const [typing, setTyping]     = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');

    const userMsg = { id: Date.now(), role: 'user', text: q };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 600 + Math.random() * 600));
    const response = getTutorResponse(q);
    setTyping(false);
    setMessages(prev => [...prev, { id: Date.now() + 1, role: 'bot', text: response }]);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const renderText = (text) => {
    // Bold markdown parser
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} style={{ color: 'var(--accent-cyan)' }}>{p.slice(2,-2)}</strong>
        : <span key={i}>{p}</span>
    );
  };

  return (
    <div>
      <div className="page-header" style={{ marginBottom: 'var(--space-md)' }}>
        <div>
          <h1 className="page-title text-gradient">🤖 AI Tutor</h1>
          <p className="page-subtitle">Ask any academic doubt</p>
        </div>
        <div className="badge badge-cyan animate-pulse">ARIS AI</div>
      </div>

      <div className="chat-container">
        {/* Quick Questions */}
        <div className="quick-btns">
          {QUICK_QUESTIONS.slice(0, 4).map(q => (
            <button key={q} className="quick-btn" onClick={() => sendMessage(q)}>{q}</button>
          ))}
        </div>

        {/* Messages */}
        <div className="chat-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-msg ${msg.role}`}>
              {msg.role === 'bot' && (
                <div className="bot-header">🤖 ARIS Tutor</div>
              )}
              <div style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                {renderText(msg.text)}
              </div>
            </div>
          ))}

          {typing && (
            <div className="chat-msg bot" style={{ display: 'flex', gap: 6, alignItems: 'center', padding: '12px 16px' }}>
              {[0,1,2].map(i => (
                <span key={i} style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--accent-primary)',
                  display: 'inline-block',
                  animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`
                }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <input
            id="chat-input"
            type="text"
            className="chat-input"
            placeholder="Ask your doubt... e.g. What is photosynthesis?"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
          />
          <button id="chat-send" className="chat-send-btn" onClick={() => sendMessage()} aria-label="Send message">
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}
