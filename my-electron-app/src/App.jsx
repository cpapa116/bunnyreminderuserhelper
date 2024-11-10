import React from 'react';
import './App.css';
import Header from './Header/Header.jsx';
import CurrentReminders from './CurrentReminders/CurrentReminders.jsx';
import AddReminder from './AddReminder/AddReminder.jsx';

const App = () => {
    return (
        <div className="App">
            <Header />
            {/* <CurrentReminders />
            <AddReminder /> */}
        </div>
    );
};

export default App;