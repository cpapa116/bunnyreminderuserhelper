const { app, BrowserWindow, Notification, ipcMain } = require('electron');
const player = require('play-sound')();
const path = require('path');

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Load the index.html file
    mainWindow.loadFile('index.html');

    // Open the DevTools in development mode
    mainWindow.webContents.openDevTools();
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