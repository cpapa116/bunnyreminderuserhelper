const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database(path.join(__dirname, 'database.db')); //create database from database.js

db.serialize(() => {//create table for Reminders
    db.run("CREATE TABLE IF NOT EXISTS Reminders (id INTEGER PRIMARY KEY, reminderName TEXT, dueDate INTEGER)", (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });
});

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("noapikeyforyou");
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

ipcMain.handle('add-reminder', (event, reminderName, dueDate) => {
    return new Promise((resolve,reject) => {
        const inSql = 'INSERT INTO Reminders (reminderName, dueDate) VALUES (?,?)';
        db.run(inSql,[reminderName,dueDate],function(err){
            if(err){
                reject(err)
            } else {
                resolve({ id: this.lastID, reminderName, dueDate });
            }
        });
    });
});

ipcMain.handle('remove-reminder', (event, reminderName, dueDate) => {
    return newPromise((resolve,reject) => {
        const outSql = 'DELETE FROM Reminders (reminderName, dueDate) VALUES (?,?)';
        db.run(outSql,[reminderName,dueDate],function(err){
            if(err){
                reject(err);
            } else {
                resolve({ id: this.lastID, reminderName, dueDate});
            }
        });
    });
});