import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, getRoleDescription } from '../services/gemini';
import './ChatInterface.css';

const ChatInterface = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialMessage = {
      text: "Oh my whiskers, you're late! You better have a good reason for summoning me when I have a very important date!",
      sender: 'bot'
    };
    setMessages([initialMessage]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await getGeminiResponse(input);
      const botMessage = { 
        text: response,
        sender: 'bot'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { 
        text: "Oh dear, oh dear! That makes absolutely no sense, you're late! Try again, and this time make it coherent!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      {/* Close button */}
      <button onClick={onClose} className="chat-close-button">×</button>
      
      {/* Character info card */}
      <div className="character-info-card">
        <div className="character-info-content">
          <div className="character-avatar">
            🐰
          </div>
          <div className="character-details">
            <h2>White Rabbit</h2>
            <p>{getRoleDescription()}</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="messages-area">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender}`}
          >
            <div className="message-bubble">
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="loading-message">*Anxiously checking pocket watch*</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Quickly now, state your business..."
          disabled={isLoading}
          className="chat-input"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="chat-submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;