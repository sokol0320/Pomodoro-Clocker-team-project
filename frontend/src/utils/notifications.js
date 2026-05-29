// notifications.js


export const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission();
    }
};


export const sendNotification = (title, options) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, options);
    }
};


export const notifyTimerEnd = (stage) => {
    if (stage === 'focus') {
        sendNotification('Час фокусування закінчився!', {
            body: 'Чудова робота! Пора зробити перерву.',
            icon: '/favicon.ico' // Переконайтеся, що шлях до іконки правильний
        });
    } else {
        sendNotification('Перерва закінчилася!', {
            body: 'Час повертатися до роботи. Ви зможете!',
            icon: '/favicon.ico'
        });
    }
};