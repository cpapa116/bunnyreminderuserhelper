const { contextBridge, ipcRenderer } = require('electron');

// Expose methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),  // Send data to the main process
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // Receive data from the main process
});
