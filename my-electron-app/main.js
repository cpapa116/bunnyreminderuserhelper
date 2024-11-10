const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyBCth1GxRvwRFSz-Ck1ZaiWSbmfZKqyFUw");
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const db = require("./database");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Handle Gemini API requests
ipcMain.handle('gemini-generate', async (event, prompt) => {
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error('Error in main process:', error);
        throw error;
    }
});

ipcMain.on('my-channel', (event, data) => {
    console.log('Received from renderer:', data);
    event.reply('my-channel-response', 'Hello from the main process');
});