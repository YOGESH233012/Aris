import React from 'react';
import { getLevel, getLevelProgress, getNextLevel, formatXP } from '../utils/gamification';

export default function XPBar({ xp = 0 }) {
  const level    = getLevel(xp);
  const nextLvl  = getNextLevel(xp);
  const progress = getLevelProgress(xp);

  return (
    <div className="xp-bar-wrapper">
      <div className="xp-level-row">
        <div className="xp-level-badge">
          <span style={{ fontSize: '1.2rem' }}>{level.emoji}</span>
          <span className="text-gradient font-bold">{level.name}</span>
        </div>
        <span className="xp-current font-mono">
          {formatXP(xp)} XP {nextLvl ? `/ ${formatXP(nextLvl.minXP)}` : '(MAX)'}
        </span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill gold" style={{ width: `${progress}%` }} />
      </div>
      <div className="flex justify-between mt-xs">
        <span className="text-xs text-muted">{level.name}</span>
        {nextLvl && <span className="text-xs text-muted">{nextLvl.emoji} {nextLvl.name}</span>}
      </div>
    </div>
  );
}
