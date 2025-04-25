# 📦 Spam Detection Agent — Project Requirements

## Overview

This project is an AI-powered **Spam Detection Agent** built with **Node.js**, **Express.js**, and **LangChain**, emulating a FlowiseAI sequential agent flow. It detects spam messages using GPT-4o-mini and persists conversational state using SQLite.

---

## 📁 Project Structure

```
spam-detector/
├── .env
├── server.js
├── llm.js
├── memory.js
├── spamDetector.js
├── package.json
└── spam_agent.db (created at runtime)
```

---

## 🧱 Dependencies

Install via npm:

```bash
npm install express dotenv sqlite3 langchain @langchain/openai @langchain/core @langchain/community
```

---

## 🔐 Environment Variables

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## 🔧 Core Modules

### `llm.js`
- Uses GPT-4o-mini via OpenAI for message classification.
- Temperature set to 0 for deterministic output.

### `memory.js`
- Manages user session state using SQLite.
- Functions: `saveState(sessionId, state)` and `getState(sessionId, callback)`.

### `spamDetector.js`
- Contains system prompt with spam detection rules.
- `detectSpam(message)` invokes the LLM and returns `"SPAM"` or `"NOT SPAM"` results with explanations.

### `server.js`
- Express.js REST API.
- Endpoint: `POST /check-message` accepts `sessionId` and `message`, classifies it, and persists the result.

---

## 📨 API Example

**Request:**

```json
POST /check-message
{
  "sessionId": "user-1234",
  "message": "Congratulations! You've won a lottery of $1,000,000. Send your bank details to claim."
}
```

**Response:**

```json
{
  "result": "SPAM - Suspicious financial offers (lottery winnings scam)."
}
```

---

## ✅ Functional Summary

| FlowiseAI Node     | Node.js Equivalent             |
|--------------------|--------------------------------|
| Start              | `POST /check-message`          |
| ChatOpenAI         | `llm.js` with GPT-4o-mini      |
| SQLite Memory      | `memory.js`                    |
| Agent (Spam logic) | `spamDetector.js`              |
| End                | Response to client             |

---

## 🏁 Notes

- GPT model: `gpt-4o-mini`
- SQLite database: `spam_agent.db`
- System prompt includes detailed spam criteria with exceptions.