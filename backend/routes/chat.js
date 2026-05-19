const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are SkinDx Assistant, a helpful AI for the SkinDx dermatology app.
Do not use markdown formatting, asterisks, bullet symbols, or special characters in your responses. Use plain text only.

You can help users with:
1. General skin health questions and advice
2. Explaining skin condition diagnoses and what they mean
3. Guiding users through the photo upload and diagnosis process
4. Answering questions about specific skin conditions detected by the app

Guidelines:
- Be empathetic and clear — users may be anxious about their skin conditions
- For serious symptoms, always recommend consulting a dermatologist
- Keep responses concise and friendly
- When explaining diagnoses, use simple non-technical language`;

router.post('/', verifyToken, async (req, res) => {
  const { messages, diagnosisContext } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  try {
    const systemWithContext = diagnosisContext
      ? `${SYSTEM_PROMPT}\n\nCurrent diagnosis context: The user has just received a diagnosis of "${diagnosisContext.condition}" with ${diagnosisContext.confidence}% confidence. Be ready to explain this result.`
      : SYSTEM_PROMPT;

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemWithContext,
    });

    // Filter out leading assistant messages 
    const allButLast = messages.slice(0, -1);
    const firstUserIndex = allButLast.findIndex(m => m.role === 'user');
    const filteredHistory = firstUserIndex === -1 ? [] : allButLast.slice(firstUserIndex);

    const history = filteredHistory.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error('Gemini chat error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      error: 'Failed to get response',
      details: err.message 
    });
  }
});

module.exports = router;
