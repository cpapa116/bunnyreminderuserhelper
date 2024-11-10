const { ipcRenderer } = require('electron');

// Send IPC message to show the notification
function sendNotification() {
    ipcRenderer.send('show-notification', '<Notification Title>', '<Notification Body>');
}

module.exports = { sendNotification };