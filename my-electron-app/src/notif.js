// Listen for button click to send notification
document.getElementById('notifyBtn').addEventListener('click', () => {
    window.electron.sendNotification();
});