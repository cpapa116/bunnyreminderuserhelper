import './AddReminder.css';
import React, { useState } from 'react';
import { addReminder, getReminders } from '../../database';

const AddReminders = () => {
    const [reminderName, setReminderName] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleAddReminder = () => {
      if (!reminderName || !selectedDate || !selectedTime) {
          setErrorMessage('Please fill in all fields.');
          return;
      }

      const fullDate = `${selectedDate}T${selectedTime}`;
      const dueDate = new Date(fullDate).getTime();

      // Call the addReminder function from database.js
      addReminder(reminderName, dueDate, (err, result) => {
          if (err) {
              console.error('Error adding reminder:', err);
              setErrorMessage('Failed to add reminder.');
          } else {
              console.log('Reminder added:', result);
              setErrorMessage('');
              setReminderName('');
              setSelectedDate('');
              setSelectedTime('');
          }
      });
    }

    return (
        <div className='add-reminder-container'>
          <p className='add-reminder-title'>Add Reminder</p>
          
          {/* Reminder Name Row */}
          <div className='reminder-name-row'>
            <p className='column-title'>Reminder Name</p>
            <input type="text" className='input' placeholder='Enter reminder name' />
          </div>

          {/* Columns for Due Date, Time, and Add */}
          <div className='columns-container'>
            <div className='column'>
              <p className='column-title'>Due Date</p>
              <input
                type="date"
                className='input'
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className='column'>
              <p className='column-title'>Time</p>
              <input
                type="time"
                className='input'
                value={selectedTime}
                onChange={handleTimeChange}
              />
            </div>
            <div className='column'>
              <p className='column-title'>Add</p>
              <button className='add-button' onClick={handleAddReminder}>Add</button>
            </div>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default AddReminders;