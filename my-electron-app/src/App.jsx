import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './Header/Header.jsx';
import CurrentReminders from './CurrentReminders/CurrentReminders.jsx';
import AddReminder from './AddReminder/AddReminder.jsx';

const App = () => {
    const [reminders, setReminders] = useState([]); //used to hold all reminders

    const getReminders = async() => {
        try{
          const result = await window.api.getReminders(); //api call to get all reminders to render
          setReminders(result);
        } catch (error) {
          console.error('Failed to get reminders: ', error);
        }
      }

    useEffect(() => { //get all reminders on startup
        getReminders();
    },[]);

    return (
        <div className="App">
            <Header />
            <CurrentReminders getReminders={getReminders} reminders={reminders}/>
            <AddReminder getReminders={getReminders}/>
        </div>
    );
};

export default App;