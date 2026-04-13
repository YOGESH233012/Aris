import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import {
  doc, getDoc, setDoc, updateDoc, collection,
  addDoc, getDocs, query, where, deleteDoc, serverTimestamp, in as whereIn,
} from 'firebase/firestore';
import { XP_REWARDS, calcFPS, earnedBadges } from '../utils/gamification';
import { requestNotificationPermission, startNotificationLoop } from '../utils/notifications';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '', school: '', cls: '', subjects: [],
  xp: 0, streak: 0, lastLoginDate: '', badges: [],
  totalCompleted: 0, perfectDays: 0, role: 'user',
};

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS = {
  get: (k, def) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};

export function AppProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [profile, setProfile] = useState(null);
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts]   = useState([]);
  const [useLocal, setUseLocal] = useState(false); // fallback to localStorage if Firebase fails
  const [notifications, setNotifications] = useState([]);

  // ── Toast helper ─────────────────────────────────────────────────────────
  const toast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  // ── Load profile + tasks ──────────────────────────────────────────────────
  const loadData = useCallback(async (uid) => {
    try {
      // Try Firebase
      const profSnap = await getDoc(doc(db, 'users', uid));
      let prof = profSnap.exists() ? profSnap.data() : { ...DEFAULT_PROFILE };
      setProfile(prof);
      LS.set('aris_profile', prof);

      const today = new Date().toDateString();
      const taskSnap = await getDocs(
        query(collection(db, 'users', uid, 'tasks'), where('date', '==', today))
      );
      const ts = taskSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTasks(ts);
      LS.set('aris_tasks', ts);

      const notifSnap = await getDocs(
        query(collection(db, 'notifications'), where('to', whereIn, [uid, 'all']))
      );
      const notifs = notifSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(notifs);

      setUseLocal(false);
    } catch {
      // Fallback to localStorage
      setUseLocal(true);
      setProfile(LS.get('aris_profile', { ...DEFAULT_PROFILE }));
      setTasks(LS.get('aris_tasks', []));
    }
  }, []);

  // ── Auth state listener ───────────────────────────────────────────────────
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await loadData(u.uid);
        checkDailyLogin(u.uid);
      } else {
        // Check for local guest session
        const guestProfile = LS.get('aris_profile', null);
        if (guestProfile && guestProfile.name) {
          setUser({ uid: 'guest', email: 'guest@aris.local' });
          setProfile(guestProfile);
          setTasks(LS.get('aris_tasks', []));
          setUseLocal(true);
        }
        setUser(prev => prev);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // ── Notification loop ─────────────────────────────────────────────────────
  useEffect(() => {
    requestNotificationPermission();
    const stop = startNotificationLoop(() => tasks);
    return stop;
  }, [tasks]);

  // ── Daily login XP + streak ───────────────────────────────────────────────
  const checkDailyLogin = async (uid) => {
    try {
      const today = new Date().toDateString();
      const profSnap = await getDoc(doc(db, 'users', uid));
      if (!profSnap.exists()) return;
      const prof = profSnap.data();
      if (prof.lastLoginDate === today) return;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = prof.lastLoginDate === yesterday.toDateString();
      const newStreak = wasYesterday ? (prof.streak || 0) + 1 : 1;
      const streakBonus = newStreak % 7 === 0 ? XP_REWARDS.STREAK_7 : 0;
      const newXP = (prof.xp || 0) + XP_REWARDS.DAILY_LOGIN + streakBonus;

      await updateDoc(doc(db, 'users', uid), {
        lastLoginDate: today, streak: newStreak, xp: newXP,
      });
      setProfile(p => ({ ...p, lastLoginDate: today, streak: newStreak, xp: newXP }));
      toast(`🎉 Daily login bonus! +${XP_REWARDS.DAILY_LOGIN} XP`);
      if (streakBonus) toast(`🔥 ${newStreak}-day streak bonus! +${streakBonus} XP`);
    } catch {
      // local
      const today = new Date().toDateString();
      const prof = LS.get('aris_profile', DEFAULT_PROFILE);
      if (prof.lastLoginDate === today) return;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const wasYesterday = prof.lastLoginDate === yesterday.toDateString();
      const newStreak = wasYesterday ? (prof.streak || 0) + 1 : 1;
      const newXP = (prof.xp || 0) + XP_REWARDS.DAILY_LOGIN;
      const updated = { ...prof, lastLoginDate: today, streak: newStreak, xp: newXP };
      LS.set('aris_profile', updated);
      setProfile(updated);
      toast(`🎉 Daily login bonus! +${XP_REWARDS.DAILY_LOGIN} XP`);
    }
  };

  // ── Auth actions ──────────────────────────────────────────────────────────
  const signup = async (email, password, profileData) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const prof = { ...DEFAULT_PROFILE, ...profileData, lastLoginDate: new Date().toDateString(), streak: 1, xp: 10 };
      await setDoc(doc(db, 'users', cred.user.uid), prof);
      setProfile(prof);
      LS.set('aris_profile', prof);
      toast('🎉 Welcome to ARIS! +10 XP bonus!');
      return { success: true };
    } catch (e) {
      // Local fallback signup
      const prof = { ...DEFAULT_PROFILE, ...profileData, lastLoginDate: new Date().toDateString(), streak: 1, xp: 10 };
      LS.set('aris_profile', prof);
      LS.set('aris_tasks', []);
      setProfile(prof);
      setTasks([]);
      setUser({ uid: 'guest', email });
      setUseLocal(true);
      toast('✅ Account created (offline mode)!');
      return { success: true };
    }
  };

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (e) {
      // Try local
      const prof = LS.get('aris_profile', null);
      if (prof && prof.name) {
        setUser({ uid: 'guest', email });
        setProfile(prof);
        setTasks(LS.get('aris_tasks', []));
        setUseLocal(true);
        toast('✅ Logged in (offline mode)');
        setLoading(false);
        return { success: true };
      }
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    try { await signOut(auth); } catch {}
    setUser(null); setProfile(null); setTasks([]);
    LS.set('aris_profile', null);
    LS.set('aris_tasks', []);
  };

  // ── Profile update ────────────────────────────────────────────────────────
  const updateProfile = async (data) => {
    const updated = { ...profile, ...data };
    setProfile(updated);
    LS.set('aris_profile', updated);
    try {
      if (user && !useLocal) await updateDoc(doc(db, 'users', user.uid), data);
    } catch {}
    toast('✅ Profile updated!');
  };

  // ── Send admin notification ────────────────────────────────────────────────
  const sendAdminNotification = async (title, message, toUser = null) => {
    if (!user || profile?.role !== 'admin') return { success: false, error: 'Not authorized' };
    try {
      await addDoc(collection(db, 'notifications'), {
        title,
        message,
        from: user.uid,
        to: toUser || 'all',
        timestamp: serverTimestamp(),
      });
      toast('✅ Notification sent!');
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // ── XP update ─────────────────────────────────────────────────────────────
  const addXP = useCallback(async (amount, reason) => {
    const newXP = Math.max(0, (profile?.xp || 0) + amount);
    const newBadges = earnedBadges({ ...profile, xp: newXP });
    const updated = { ...profile, xp: newXP, badges: [...(profile?.badges || []), ...newBadges] };
    setProfile(updated);
    LS.set('aris_profile', updated);
    try {
      if (user && !useLocal) await updateDoc(doc(db, 'users', user.uid), { xp: newXP, badges: updated.badges });
    } catch {}
    if (amount > 0) toast(`⭐ +${amount} XP — ${reason}`);
    else toast(`💔 ${amount} XP — ${reason}`);
    newBadges.forEach(b => toast(`🏅 New Badge Unlocked: ${b}!`));
  }, [profile, user, useLocal, toast]);

  // ── Task actions ──────────────────────────────────────────────────────────
  const addTask = async (taskData) => {
    const today = new Date().toDateString();
    const newTask = { ...taskData, completed: false, date: today, createdAt: Date.now() };
    try {
      if (user && !useLocal) {
        const ref = await addDoc(collection(db, 'users', user.uid, 'tasks'), newTask);
        newTask.id = ref.id;
      } else {
        newTask.id = `local_${Date.now()}`;
      }
    } catch {
      newTask.id = `local_${Date.now()}`;
    }
    const updated = [...tasks, newTask];
    setTasks(updated);
    LS.set('aris_tasks', updated);
    toast('✅ Mission added!');
  };

  const completeTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const now = new Date();
    const [th, tm] = (task.time || '00:00').split(':').map(Number);
    const taskTime = new Date(); taskTime.setHours(th, tm, 0, 0);
    const onTime = now <= taskTime;
    const xpGain = onTime ? XP_REWARDS.COMPLETE_ON_TIME : XP_REWARDS.COMPLETE_LATE;

    const updated = tasks.map(t => t.id === taskId ? { ...t, completed: true, completedAt: Date.now() } : t);
    setTasks(updated);
    LS.set('aris_tasks', updated);

    // Check perfect day
    const allDone = updated.every(t => t.completed);
    let extraXP = 0;
    if (allDone) {
      extraXP = XP_REWARDS.PERFECT_DAY;
      const newPerfect = (profile.perfectDays || 0) + 1;
      const profUpdated = { ...profile, perfectDays: newPerfect, totalCompleted: (profile.totalCompleted||0)+1 };
      setProfile(profUpdated);
      LS.set('aris_profile', profUpdated);
      try { if (user && !useLocal) await updateDoc(doc(db, 'users', user.uid), { perfectDays: newPerfect, totalCompleted: profUpdated.totalCompleted }); } catch {}
      toast('💎 PERFECT DAY! All missions complete!');
    } else {
      const profUpdated = { ...profile, totalCompleted: (profile.totalCompleted||0)+1 };
      setProfile(profUpdated);
      LS.set('aris_profile', profUpdated);
      try { if (user && !useLocal) await updateDoc(doc(db, 'users', user.uid), { totalCompleted: profUpdated.totalCompleted }); } catch {}
    }

    try {
      if (user && !useLocal) await updateDoc(doc(db, 'users', user.uid, 'tasks', taskId), { completed: true, completedAt: Date.now() });
    } catch {}

    await addXP(xpGain + extraXP, onTime ? 'On-time completion!' : 'Task completed');
  };

  const deleteTask = async (taskId) => {
    const updated = tasks.filter(t => t.id !== taskId);
    setTasks(updated);
    LS.set('aris_tasks', updated);
    try {
      if (user && !useLocal) await deleteDoc(doc(db, 'users', user.uid, 'tasks', taskId));
    } catch {}
    toast('🗑️ Mission deleted');
  };

  const value = {
    user, profile, tasks, loading, toasts, useLocal,
    signup, login, logout, updateProfile, addTask, completeTask, deleteTask, addXP, toast,
    fps: calcFPS(tasks),
    completedToday: tasks.filter(t => t.completed).length,
    totalToday: tasks.length,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
