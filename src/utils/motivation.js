// AI Motivation Logic — Rule-Based Messages

export function getMotivationMessage({ tasksToday, completedToday, streak, lastActivityHours }) {
  const total = tasksToday || 0;
  const done = completedToday || 0;
  const hrs = lastActivityHours ?? 0;

  if (total > 0 && done === total) {
    return { msg: "🔥 Perfect day! All missions completed. You're unstoppable!", color: '#00e676', bg: 'rgba(0,230,118,0.1)', border: 'rgba(0,230,118,0.3)' };
  }
  if (streak >= 7) {
    return { msg: "👑 7-day streak! You're a true Master. Keep dominating!", color: '#ffd700', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.3)' };
  }
  if (streak >= 3) {
    return { msg: "🔥 Great consistency! " + streak + " days strong. Don't stop now!", color: '#bd93f9', bg: 'rgba(189,147,249,0.1)', border: 'rgba(189,147,249,0.3)' };
  }
  if (done > 0 && done < total) {
    return { msg: `💪 ${done}/${total} missions done! Keep pushing — finish strong!`, color: '#6c63ff', bg: 'rgba(108,99,255,0.1)', border: 'rgba(108,99,255,0.3)' };
  }
  if (hrs > 6) {
    return { msg: "📢 Come back! Your streak is at risk. Open a mission NOW!", color: '#ff6584', bg: 'rgba(255,101,132,0.1)', border: 'rgba(255,101,132,0.3)' };
  }
  if (total === 0 || done === 0) {
    return { msg: "⚡ Start now! Your first mission is waiting. Let's GO!", color: '#ff9100', bg: 'rgba(255,145,0,0.1)', border: 'rgba(255,145,0,0.3)' };
  }
  return { msg: "🎯 ARIS is active. Stay focused and complete your daily goals!", color: '#00d4ff', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.3)' };
}

export function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return '🌅 Good morning';
  if (h < 17) return '☀️ Good afternoon';
  if (h < 21) return '🌆 Good evening';
  return '🌙 Good night';
}
