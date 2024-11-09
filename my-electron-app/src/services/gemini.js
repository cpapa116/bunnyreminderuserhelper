export const getGeminiResponse = async (prompt) => {
    try {
      if (!window.api?.gemini) {
        throw new Error('Gemini API not initialized');
      }
      return await window.api.gemini.generateResponse(prompt);
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };