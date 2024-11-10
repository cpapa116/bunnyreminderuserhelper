import './AddReminder.css';
import React, { useState } from 'react';

const AddReminders = ({ getReminders }) => {
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
    const handleReminderChange = (e) => { //used to update text input box with characters that user is currently typing
      setReminderName(e.target.value);
    };

    const handleAddReminder = async() => {
      if (reminderName && selectedDate && selectedTime) { //if all fields are filled out
        const fullDate = `${selectedDate}T${selectedTime}`;
        const dueDate = new Date(fullDate).getTime();
        try{
          const result = await window.api.addReminder(reminderName, dueDate); //api call to database to add a reminder
          setErrorMessage(''); //no errors to present
          setReminderName(''); //erase reminder name field
          setSelectedDate(''); //erase date field
          setSelectedTime(''); //erase time field
          getReminders();
        } catch (err) { //failed to add reminder to database
          console.error('Error adding reminder', err); //!log error for now
          setErrorMessage('Failed to add reminder'); //set error to show failure to add reminder
        }
      } else { //all fields were not filled out
        setErrorMessage('Please fill in all fields'); //notify user that all fields are not filled out
        return;
      }
    }

    return (
        <div className='add-reminder-container'>
          <p className='add-reminder-title'>Add Reminder</p>
          
          {/* Reminder Name Row */}
          <div className='reminder-name-row'>
            <p className='column-title'>Reminder Name</p>
            <input 
              type="text" 
              className='input'
              value={reminderName}
              onChange={handleReminderChange}
              placeholder='Enter reminder name'
            />
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
              <button className='add-button'onClick={handleAddReminder}>Add</button>
            </div>
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default AddReminders;