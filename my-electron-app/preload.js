const { contextBridge, ipcRenderer } = require('electron');


// Expose methods to the renderer process
contextBridge.exposeInMainWorld('electron', {
    send: (channel, data) => ipcRenderer.send(channel, data),  // Send data to the main process
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // Receive data from the main process
});

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { sendNotification } = require('./src/Notifications');

// Replace with your actual API key
const API_KEY = '';
const genAI = new GoogleGenerativeAI(API_KEY);

contextBridge.exposeInMainWorld(
    'api', {
        gemini: {
            generateResponse: async (prompt) => {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    return response.text();
                } catch (error) {
                    console.error('Gemini API Error:', error);
                    throw error;
                }
            }
        }
    }
);

contextBridge.exposeInMainWorld(
    'electron', {
        sendNotification: () => { sendNotification(); }
        //onNotificationReceived: (callback) => ipcRenderer.on('notification-reply', callback)
    }
);
