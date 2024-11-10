const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const player = require('play-sound')();
const path = require('path');
const db = require("./database"); //create database from database.js
const { ipcMain } = require('electron');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: false,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Set CSP headers
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self'; connect-src 'self' https://generativelanguage.googleapis.com; script-src 'self' 'unsafe-eval'"
                ]
            }
        });
    });

    mainWindow.loadFile('index.html');
}

// Listen for the 'show-notification' event from the renderer
ipcMain.on('show-notification', (event, title, body) => {
    const notification = new Notification({
        title: title,
        body: body
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

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

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

ipcMain.on('my-channel', (event, data) => {
    console.log('Received from renderer:', data);
    // Send a response back to the renderer
    event.reply('my-channel-response', 'Hello from the main process');
});