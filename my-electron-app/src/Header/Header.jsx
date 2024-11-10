import './Header.css';
import React, { useState, useRef } from 'react';
import ChatInterface from '../ChatInterface/ChatInterface.jsx';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const modalRef = useRef(null);

    const openModal = () => setIsModalOpen(true);
    
    const handleOverlayClick = (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className='header-container'>
            <p className='title'>bruh</p>
            <button onClick={openModal} className='chat-button'>Chat</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={handleOverlayClick}>
                    <div className="modal-container floating">
                        <ChatInterface />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;