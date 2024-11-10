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
        }
    }
);