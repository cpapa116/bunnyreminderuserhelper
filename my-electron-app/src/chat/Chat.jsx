import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse, getRoleDescription } from './services/gemini';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const initialMessage = {
      text: "Surprise motherfucker! I'm Sergeant Doakes, and you better have a good reason for being here.",
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
        text: "Something's not right here, motherfucker. Say that again and this time make it make sense!",
        sender: 'bot'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* Character info card */}
      <div className="bg-slate-800 rounded-lg p-4 mb-4 shadow-sm border border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-white">
            👮
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Sgt. Doakes</h2>
            <p className="text-sm text-slate-300">{getRoleDescription()}</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto mb-4 border rounded-lg p-4 bg-slate-50">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${
              message.sender === 'user' ? 'text-right' : 'text-left'
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg max-w-[80%] ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-slate-600 italic">Doakes is watching...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Report to Sergeant Doakes..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 disabled:bg-slate-400"
        >
          Send
        </button>
      </form>
    </div>
  );
};

const Chat = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <header className="bg-slate-800 shadow-sm">
                <div className="max-w-4xl mx-auto py-4 px-4">
                    <h1 className="text-2xl font-bold text-white">Miami Metro PD</h1>
                </div>
            </header>
            <main className="max-w-4xl mx-auto mt-4">
                <ChatInterface />
            </main>
        </div>
    );
};

export default Chat;