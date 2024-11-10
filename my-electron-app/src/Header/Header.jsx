import './Header.css';
import React, { useState } from 'react';
import ChatInterface from '../ChatInterface/ChatInterface.jsx';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const openModal = () => {
        setIsClosing(false);
        setIsModalOpen(true);
    };
    
    const handleClose = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsClosing(true);
            // Wait for animation to complete before removing from DOM
            setTimeout(() => {
                setIsModalOpen(false);
                setIsClosing(false);
            }, 500); // Match this with your animation duration
        }
    };

    return (
        <div className='header-container'>
            <p className='title'>bruh</p>
            <button onClick={openModal} className='chat-button'>Chat</button>

            {/* Modal */}
            {isModalOpen && (
                <div className={`modal-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
                    <div className={`modal-container floating ${isClosing ? 'closing' : ''}`}>
                        <ChatInterface />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;