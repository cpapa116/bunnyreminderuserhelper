const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.db'));

// Create the table if it doesn't already exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS Reminders (id INTEGER PRIMARY KEY, reminderName TEXT, dueDate INTEGER)");
});

// Function to add a reminder
function addReminder(reminderName, dueDate, callback) {
    const sql = `INSERT INTO Reminders (reminderName, dueDate) VALUES (?, ?)`;
    db.run(sql, [reminderName, dueDate], function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { id: this.lastID, reminderName, dueDate });
        }
    });
}

// Function to get all reminders
function getReminders(callback) {
    const sql = `SELECT * FROM Reminders`;
    db.all(sql, (err, rows) => {
        if (err) {
            callback(err);
        } else {
            callback(null, rows);
        }
    });
}

// Function to remove a reminder by id
function removeReminder(id, callback) {
    const sql = `DELETE FROM Reminders WHERE id = ?`;
    db.run(sql, id, function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null, { deletedID: id });
        }
    });
}

// Export the database and methods
module.exports = {
    db,
    addReminder,
    getReminders,
    removeReminder,
};
