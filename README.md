# ARIS — Adaptive Routine Intelligence System

![ARIS](https://img.shields.io/badge/ARIS-Student%20Productivity-6c63ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646cff?style=for-the-badge&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-Enabled-orange?style=for-the-badge&logo=firebase)
![PWA](https://img.shields.io/badge/PWA-Ready-green?style=for-the-badge)

> **Study Planner + Game + AI Assistant** — All in one mobile-first web app for students.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎯 **Missions** | Create daily tasks with subject, time & priority |
| ⭐ **XP System** | Earn XP for completing tasks on time (+50 XP) |
| 🔥 **Streaks** | Daily login streaks with bonus rewards |
| 🎮 **Levels** | Beginner → Explorer → Scholar → Achiever → Master |
| 📊 **FPS Score** | Focus Performance Score based on task completion |
| 🏅 **Badges** | Unlock achievements for milestones |
| 🤖 **AI Tutor** | 50+ topic Q&A across Math, Science, English, History, Geography, CS |
| 📈 **Analytics** | Subject-wise charts, weekly activity, weak subject detection |
| 💬 **Motivation** | Rule-based AI messages based on your activity |
| 🔔 **Notifications** | Time-based task reminders via Web Notifications |
| 📱 **PWA** | Install on Android/iOS like a native app |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm 9+

### Run Locally
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/aris-app.git
cd aris-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🔥 Firebase Setup (Optional)

The app works fully **offline** using localStorage. To enable cloud sync:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project → Enable **Authentication** (Email/Password) + **Firestore**
3. Copy your config and replace in `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...
};
```

---

## 📦 Build for Production

```bash
npm run build
```

Output goes to `dist/` folder. Deploy to **Vercel**, **Netlify**, or **GitHub Pages**.

---

## 📱 Convert to Android APK

### Method 1 — PWABuilder (Easiest, Free)
1. Deploy app to Vercel/Netlify (free)
2. Go to **https://www.pwabuilder.com**
3. Enter your deployed URL
4. Click **Build → Android** → Download APK

### Method 2 — Capacitor
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init
npx cap add android
npm run build
npx cap copy
npx cap open android   # Opens Android Studio
```

---

## 🗂️ Project Structure

```
src/
├── pages/
│   ├── Auth.jsx          # Login & Signup
│   ├── Dashboard.jsx     # Home screen
│   ├── Missions.jsx      # Task management
│   ├── Analytics.jsx     # Charts & progress
│   ├── AiTutor.jsx       # Chat Q&A
│   └── Profile.jsx       # User profile
├── components/
│   ├── Navbar.jsx        # Bottom navigation
│   ├── XPBar.jsx         # XP progress bar
│   ├── FPSRing.jsx       # SVG performance ring
│   └── AddTaskModal.jsx  # Add task modal
├── context/
│   └── AppContext.jsx    # Global state (Firebase + localStorage)
├── utils/
│   ├── gamification.js  # XP, levels, badges
│   ├── motivation.js    # Rule-based AI messages
│   ├── notifications.js # Time-based alerts
│   └── tutorLogic.js    # AI Q&A engine (50+ topics)
├── App.jsx
├── main.jsx
└── index.css            # Dark theme design system
```

---

## 🎮 Gamification Rules

| Action | XP |
|---|---|
| Complete task on time | +50 XP |
| Complete task late | +20 XP |
| Miss a task | -10 XP |
| Daily login | +10 XP |
| 7-day streak | +100 XP bonus |
| Perfect day (all tasks) | +75 XP |

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + Vite 5
- **Styling:** Vanilla CSS (dark glassmorphism theme)
- **State:** React Context + localStorage
- **Backend:** Firebase Auth + Firestore (optional)
- **Charts:** Recharts
- **Animations:** canvas-confetti + CSS keyframes
- **PWA:** Web App Manifest + Service Worker

---

## 📄 License

MIT © 2026 ARIS Project
