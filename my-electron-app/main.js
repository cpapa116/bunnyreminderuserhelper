const { app, BrowserWindow, ipcMain, Notification } = require('electron');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sqlite3 = require('sqlite3').verbose();
const player = require('play-sound')(); //used to play surprise for notifications


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
            preload: path.join(__dirname, 'preload.js'),
            icon: __dirname + "./src/Images/appIcons/icon.ico"
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

//handler to add reminders to the database
ipcMain.handle('add-reminder', (event, reminderName, dueDate) => {
    return new Promise((resolve,reject) => {
        const inSql = 'INSERT INTO Reminders (reminderName, dueDate) VALUES (?,?)'; //sql that inserts new reminder into database
        db.run(inSql,[reminderName,dueDate],function(err){ //execute sql
            if(err){
                reject(err)
            } else {
                resolve({ id: this.lastID, reminderName, dueDate });
            }
        });
    });
});

//handler to remove reminders from the database
ipcMain.handle('remove-reminder', (event, id) => {
    return new Promise((resolve,reject) => {
        const outSql = 'DELETE FROM Reminders WHERE id = ?'; //sql that removes reminder from database
        db.run(outSql,[id],function(err){ //execute sql
            if(err){
                reject(err);
            } else {
                resolve({ id: this.lastID });
            }
        });
    });
});

//handler to get all reminders from the database
ipcMain.handle('get-reminders', (event, reminderName, dueDate) => {
    return new Promise((resolve,reject) => {
        const getSql = 'SELECT * FROM Reminders'; //sql that gets all reminders from database
        db.all(getSql, (err,rows) => { //execute sql
            if(err){
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
});

//! UNTESTED handler to edit reminder from the database
ipcMain.handle('edit-reminder',(event,id,fieldsToEdit) => {
    return new Promise((resolve,reject) => {
        const editSql = 'UPDATE FROM Records VALUES(?,?,?)'
        db.run(editSql, function(error){
            if(error){
                reject(error);
            } else {
                resolve({id: this.lastID})
            }
        });
    });
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