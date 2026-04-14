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
  addDoc, getDocs, query, where, deleteDoc, serverTimestamp
} from 'firebase/firestore';
import { XP_REWARDS, calcFPS, earnedBadges } from '../utils/gamification';
import { requestNotificationPermission, startNotificationLoop } from '../utils/notifications';

const AppContext = createContext(null);

const DEFAULT_PROFILE = {
  name: '', school: '', cls: '', subjects: [],
  xp: 0, streak: 0, lastLoginDate: '', badges: [],
  totalCompleted: 0, perfectDays: 0, role: 'user',
};

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
  const [useLocal, setUseLocal] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
  }, []);

  const loadData = useCallback(async (uid) => {
    try {
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
        query(collection(db, 'notifications'), where('to', 'in', [uid, 'all']))
      );
      const notifs = notifSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(notifs);

      setUseLocal(false);
    } catch {
      setUseLocal(true);
      setProfile(LS.get('aris_profile', { ...DEFAULT_PROFILE }));
      setTasks(LS.get('aris_tasks', []));
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        await loadData(u.uid);
        checkDailyLogin(u.uid);
      } else {
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

  useEffect(() => {
    requestNotificationPermission();
    const stop = startNotificationLoop(() => tasks);
    return stop;
  }, [tasks]);

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

  const value = { user, profile, tasks, loading };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
