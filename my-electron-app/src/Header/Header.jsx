import './Header.css';
import React, { useState } from 'react';
import ChatInterface from '../ChatInterface/ChatInterface.jsx';

const Header = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className='header-container'>
            <p className='title'>bruh</p>
            <button onClick={openModal} className='chat-button'>Chat</button>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <ChatInterface />
                        <button
                            onClick={closeModal}
                            className="header-modal-button"
                        >
                            X
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Header;
