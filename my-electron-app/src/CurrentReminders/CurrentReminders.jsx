import './CurrentReminders.css';
import React from 'react';
import filter from '../Images/filter.png'

const CurrentReminders = () => {
    return (
        <div className='current-reminder-container'>
          <div className='current-reminder-header'>
            <p className='current-reminders-title'>Current Reminders</p>
            <div className='header-buttons'>
              <button className='filter' ><img src={filter} alt="Filter" /></button>
              <button className='mute'>Mute All</button>
            </div>
          </div>
          <div className='reminders-list-container'>
      
          </div>
        </div>
      );
}

export default CurrentReminders;