const { contextBridge, ipcRenderer } = require('electron');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Replace with your actual API key
const API_KEY = '';
const genAI = new GoogleGenerativeAI(API_KEY);

contextBridge.exposeInMainWorld(
    'api', {
        gemini: {
            generateResponse: async (prompt) => {
                try {
                    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const result = await model.generateContent(prompt);
                    const response = await result.response;
                    return response.text();
                } catch (error) {
                    console.error('Gemini API Error:', error);
                    throw error;
                }
            }
        }
    }
);