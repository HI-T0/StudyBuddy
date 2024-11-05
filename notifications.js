export function initNotifications() {
    const notificationStatus = document.getElementById('notification-status');
    const enableNotificationsButton = document.getElementById('enable-notifications');

    function updateNotificationStatus() {
        if ('Notification' in window) {
            if (Notification.permission === 'granted') {
                notificationStatus.textContent = 'Notifications are enabled.';
                enableNotificationsButton.classList.add('hidden');
            } else if (Notification.permission === 'denied') {
                notificationStatus.textContent = 'Notifications are blocked. Please enable them in your browser settings.';
                enableNotificationsButton.classList.add('hidden');
            } else {
                notificationStatus.textContent = 'Notifications are not enabled.';
                enableNotificationsButton.classList.remove('hidden');
            }
        } else {
            notificationStatus.textContent = 'Notifications are not supported in this browser.';
            enableNotificationsButton.classList.add('hidden');
        }
    }

    enableNotificationsButton.addEventListener('click', () => {
        Notification.requestPermission().then(updateNotificationStatus);
    });

    updateNotificationStatus();
}

export function sendNotification(title, body) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body });
    }
}

export function showDailyTip() {
    const tipContent = document.getElementById('tip-content');
    const tips = [
        "Take regular breaks to improve focus.",
        "Stay hydrated while studying.",
        "Review your notes before bed for better retention.",
        "Use the Pomodoro technique for efficient studying.",
        "Create a dedicated study space to minimize distractions."
    ];
    tipContent.textContent = tips[Math.floor(Math.random() * tips.length)];
}