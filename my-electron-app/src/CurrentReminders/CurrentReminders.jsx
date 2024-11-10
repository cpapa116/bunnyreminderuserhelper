import './CurrentReminders.css';
import React, { useState } from 'react';
import filter from '../Images/filter.png'
import mute from "../Images/mute.png"
import volume from "../Images/volume.png"
import delete_img from "../Images/delete.png"

const CurrentReminders = ({ getReminders, reminders }) => {
  const [sortOption, setSortOption] = useState(null);

  const formatDate = (epoch) => {
    const date = new Date(epoch);
    return date.toLocaleString();
  };

  const filterReminders = (option) => {
    let sortedReminders = [...reminders];
    if (option === "Time") {
      sortedReminders.sort((a, b) => a.timestamp - b.timestamp); // Sort by nearest date
    } else if (option === "Name") {
      sortedReminders.sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically by name
    }
    setSortOption(option); // Update selected option
    setReminders(sortedReminders); // Update reminders with sorted list
  };

  const handleRemove = async(id) => { //removes reminder by id
    try{
      const result = await window.api.removeReminder(id); //api call to remove a reminder
      getReminders(); //get reminders again to update state
    } catch (error) {
      console.error("Failed to remove reminder: ", error);
    }
  }

    return (
        <div className='current-reminder-container'>
          <div className='current-reminder-header'>
            <p className='current-reminders-title'>Current Reminders</p>
            <div className='header-buttons'>
              <button className='filter' onClick={() => filterReminders(sortOption === "Time" ? "Name" : "Time")}><img src={filter} alt="Filter" /></button>
              <button className='mute'>Mute All</button>
            </div>
          </div>
          <div className='reminders-list-container'>
            {reminders.map((reminder, index) => (
              <div key={index} className='reminder'>
                <span className='reminder-name'>{reminder.reminderName}</span>
                <span className='reminder-time'>{formatDate(reminder.dueDate)}</span>
                <button className='edit-button' >Edit</button>
                <button className='mute-img'><img src={volume} alt="Mute" /></button>
                <button className='delete-img' onClick={() => handleRemove(reminder.id)}><img src={delete_img} alt="Delete" /></button>
              </div>
            ))}
        </div>
      </div>
    );
}

export default CurrentReminders;