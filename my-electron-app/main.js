const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const db = require("./database"); //create database from database.js
const player = require('play-sound')(); //used to play surprise for notifications

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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

ipcMain.on('show-notification', (event, title, body) => { //renders notification
    const notification = new Notification({
        title: title,
        body: body,
        silent: true //needed so macos does not play an additional system sound
    });
    const audioPath = path.resolve(__dirname, 'src', 'sounds', 'surprise.mp3');
    // Play sound when notification is displayed
    player.play(audioPath, function(err) {
        if (err) {
          console.error('Error playing audio:', err);
        } else {
          console.log('Audio played successfully');
        }
    });
    
    notification.show();
});