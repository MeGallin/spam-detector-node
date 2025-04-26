import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { detectSpam } from './spamDetector.js';
import { saveState, getState } from './memory.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'API is running' });
});

// Get conversation history
app.get('/get-history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const state = await getState(sessionId);
    res.json({ history: state?.messages || [] });
  } catch (error) {
    console.error('History retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

// Clear conversation history
app.post('/clear-history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    await saveState(sessionId, {
      messages: [],
      timestamp: new Date().toISOString(),
    });
    res.json({ success: true });
  } catch (error) {
    console.error('History clear error:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

// Check message endpoint with conversation awareness
app.post('/check-message', async (req, res) => {
  try {
    const { sessionId, message, role = 'user' } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: 'Missing sessionId or message' });
    }

    // Get existing state
    const state = await getState(sessionId);
    const messages = state?.messages || [];

    // Create new message with timestamp
    const timestamp = new Date().toISOString();
    const newMessage = {
      role,
      content: message,
      timestamp,
    };

    // Add new message to history
    messages.push(newMessage);

    // Detect spam using full conversation context
    const result = await detectSpam(messages);

    // Update the last message with the result
    newMessage.result = result;

    // Save updated state
    await saveState(sessionId, {
      messages,
      lastMessage: newMessage,
      timestamp,
    });

    res.json({ result });
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
