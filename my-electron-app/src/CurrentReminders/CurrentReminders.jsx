import './CurrentReminders.css';
import React, { useState, useEffect } from 'react';
import filter from '../Images/filter.png'

const CurrentReminders = () => {
  
  useEffect(() => { //get all reminders on startup
    getReminders();
  },[]);

  const [reminders,setReminders] = useState([]); //used to hold all reminders

  const getReminders = async() => {
    try{
      const result = await window.api.getReminders(); //api call to get all reminders to render
      setReminders(result);
    } catch (error) {
      console.error('Failed to get reminders: ', error);
    }
  }


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