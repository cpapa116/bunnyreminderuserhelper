const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
    'api', {
        gemini: {
            generateResponse: async (prompt) => {
                try {
                    // Send request to main process and wait for response
                    const response = await ipcRenderer.invoke('gemini-generate', prompt);
                    return response;
                } catch (error) {
                    console.error('Error in preload:', error);
                    throw error;
                }
            }
        },
        sendNotification: () => {
            ipcRenderer.send('show-notification', 'Notification Title', 'Notification Body');
        }, //expose sendNotification to be used everywhere
        send: (channel, data) => {
            let validChannels = ['my-channel'];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['my-channel-response'];
            if (validChannels.includes(channel)) {
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        addReminder: (reminderName, dueDate) => {
            return ipcRenderer.invoke('add-reminder', reminderName, dueDate); //returns results from add api call in main.js to AddReminder.jsx
        },
        removeReminder: (id) => {
            return ipcRenderer.invoke('remove-reminder', id); //returns results from remove api call in main.js to CurrentReminders.jsx
        },
        getReminders: () => {
            return ipcRenderer.invoke('get-reminders'); //returns results from api call in main.js to CurrentReminders.jsx
        },
        editHandler: () => {
            return ipcRenderer.invoke('editHandler'); //returns results from api call in main.js to CurrentReminders.jsx
        }
});