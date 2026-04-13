// Smart Notification Logic — Time-based task alerts

let notifInterval = null;

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function sendNotification(title, body, icon = '📚') {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/aris-icon.svg' });
  }
}

export function getCurrentTimeStr() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function startNotificationLoop(getTasks) {
  if (notifInterval) clearInterval(notifInterval);
  notifInterval = setInterval(() => {
    const tasks = getTasks();
    const now = getCurrentTimeStr();
    tasks.forEach(task => {
      if (!task.completed) {
        if (task.time === now) {
          sendNotification(
            `📚 ${task.subject} Time!`,
            `Complete your mission: "${task.name}"`
          );
        }
        // Reminder if task time has passed and not done
        if (task.time < now) {
          const [th, tm] = task.time.split(':').map(Number);
          const [nh, nm] = now.split(':').map(Number);
          const diffMins = (nh * 60 + nm) - (th * 60 + tm);
          if (diffMins === 30) { // 30 min overdue reminder
            sendNotification(
              `⏰ Pending Mission!`,
              `"${task.name}" is 30 minutes overdue. Complete it now!`
            );
          }
        }
      }
    });
  }, 60000); // check every minute
  return () => clearInterval(notifInterval);
}

export function stopNotificationLoop() {
  if (notifInterval) clearInterval(notifInterval);
}
