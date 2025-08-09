export default function notifyMe(title, { body, icon }) {
    function toggleAnimation() {
        try {
            const notificationIcon = document.getElementById('notification-icon');
            if(!notificationIcon)return;
            notificationIcon.classList.toggle('animation');
            notificationIcon.classList.toggle('danger');
        } catch (error) {
            console.warn(error)
        }
    }
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification(title, { body, icon });
        toggleAnimation()
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification(title, { body, icon });
                toggleAnimation()
            }
        });
    }
    return toggleAnimation();
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them anymore.
};
// (async () => {
//     const img = "/to-do-notifications/img/icon-128.png";
//     const text = `HEY! Your task "${title}" is now overdue.`;
//     const notification = notifyMe("To do list", { body: text, icon: img });
//     notification.toggleAnimation();
// })()