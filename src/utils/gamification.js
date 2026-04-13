// Gamification Logic — XP, Levels, FPS, Badges

export const LEVELS = [
  { name: 'Beginner',  emoji: '🟢', minXP: 0,    maxXP: 500  },
  { name: 'Explorer',  emoji: '🔵', minXP: 501,   maxXP: 1500 },
  { name: 'Scholar',   emoji: '🟣', minXP: 1501,  maxXP: 3000 },
  { name: 'Achiever',  emoji: '🟠', minXP: 3001,  maxXP: 6000 },
  { name: 'Master',    emoji: '🔴', minXP: 6001,  maxXP: Infinity },
];

export const XP_REWARDS = {
  COMPLETE_ON_TIME:  50,
  COMPLETE_LATE:     20,
  MISSED_TASK:      -10,
  DAILY_LOGIN:       10,
  STREAK_7:         100,
  PERFECT_DAY:       75,
};

export const BADGES = [
  { id: 'first_mission',  name: 'First Mission',   emoji: '⚡', desc: 'Complete your first task' },
  { id: 'streak_3',       name: '3-Day Streak',    emoji: '🔥', desc: 'Study 3 days in a row' },
  { id: 'streak_7',       name: 'Week Warrior',    emoji: '🏆', desc: 'Maintain a 7-day streak' },
  { id: 'perfect_day',    name: 'Perfect Day',     emoji: '💎', desc: 'Complete all tasks in a day' },
  { id: 'level_up',       name: 'Level Up!',       emoji: '🚀', desc: 'Reach Explorer level' },
  { id: 'scholar',        name: 'Scholar',         emoji: '📚', desc: 'Reach Scholar level' },
  { id: 'master',         name: 'Master',          emoji: '👑', desc: 'Reach Master level' },
  { id: 'task_10',        name: 'Mission Star',    emoji: '⭐', desc: 'Complete 10 total tasks' },
  { id: 'subject_master', name: 'Subject Master',  emoji: '🎯', desc: 'Complete 5 tasks in one subject' },
];

export function getLevel(xp) {
  return LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP) || LEVELS[0];
}

export function getNextLevel(xp) {
  const cur = LEVELS.findIndex(l => xp >= l.minXP && xp <= l.maxXP);
  return cur < LEVELS.length - 1 ? LEVELS[cur + 1] : null;
}

export function getLevelProgress(xp) {
  const cur = LEVELS.find(l => xp >= l.minXP && xp <= l.maxXP);
  const next = getNextLevel(xp);
  if (!next) return 100;
  const range = next.minXP - cur.minXP;
  const progress = xp - cur.minXP;
  return Math.min(100, Math.round((progress / range) * 100));
}

export function calcFPS(tasks) {
  if (!tasks || tasks.length === 0) return 0;
  const completed = tasks.filter(t => t.completed).length;
  return Math.round((completed / tasks.length) * 100);
}

export function earnedBadges(profile) {
  const earned = new Set(profile.badges || []);
  const toEarn = [];

  if (profile.totalCompleted >= 1) toEarn.push('first_mission');
  if (profile.streak >= 3) toEarn.push('streak_3');
  if (profile.streak >= 7) toEarn.push('streak_7', 'streak_bonus');
  if (profile.perfectDays >= 1) toEarn.push('perfect_day');
  if (profile.xp >= 501) toEarn.push('level_up');
  if (profile.xp >= 1501) toEarn.push('scholar');
  if (profile.xp >= 6001) toEarn.push('master');
  if (profile.totalCompleted >= 10) toEarn.push('task_10');

  return toEarn.filter(b => !earned.has(b));
}

export function formatXP(xp) {
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}k`;
  return String(xp);
}
