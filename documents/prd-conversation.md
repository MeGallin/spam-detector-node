# 📄 Project Requirements Document — Conversation-Aware Spam Detection Agent

## 🧠 Project Overview

This project aims to build a spam detection agent that analyzes **full multi-turn conversations** between two or more parties to identify potential spam messages. Built using **Node.js**, **Express.js**, **LangChain**, and **OpenAI (GPT-4o-mini)**, the system is designed to mimic a FlowiseAI agent flow.

The application classifies whether an interaction is spam or not based on contextual message history, ensuring more accurate decision-making by examining the conversation in its entirety.

---

## 🏗️ Project Structure

```
conversation-spam-detector/
├── .env
├── server.js
├── llm.js
├── memory.js
├── spamDetector.js
├── package.json
└── spam_agent.db (created at runtime)
```

---

## 📦 Dependencies

Install using npm:

```bash
npm install express dotenv sqlite3 langchain @langchain/openai @langchain/core @langchain/community
```

---

## 🔐 Environment Variables

Create a `.env` file with the following:

```env
OPENAI_API_KEY=your_openai_api_key
```

---

## 🔧 Core Modules

### `llm.js`
- Initializes GPT-4o-mini via OpenAI.
- Temperature is set to `0` for deterministic classification.

### `memory.js`
- Stores user session state including **entire message history**.
- Functions:
  - `saveState(sessionId, state)`
  - `getState(sessionId, callback)`

### `spamDetector.js`
- Core logic to determine whether a full conversation contains spam.
- Uses a system prompt with detailed spam criteria and exceptions.
- Accepts full `messages[]` history instead of a single input.

### `server.js`
- REST API server with Express.
- Accepts POST requests at `/check-message` to process and classify messages.
- Persists both user and assistant messages by role.

---

## 📬 API Usage

### Endpoint

```
POST /check-message
```

### Request Body

```json
{
  "sessionId": "user-1234",
  "message": "Hi, I’m Tom Jenkins.",
  "role": "assistant"
}
```

### Response Example

```json
{
  "result": "NOT SPAM"
}
```

---

## 📚 Message History Example

```json
[
  { "role": "user", "content": "Hi" },
  { "role": "assistant", "content": "This is Tom Jenkins." },
  { "role": "user", "content": "Hi Tom." },
  { "role": "assistant", "content": "I am calling from..." }
]
```

---

## 🔍 LLM Prompt Context

A system message is used to instruct the AI on spam criteria including:

- Requests for personal/financial information.
- Suspicious financial offers or scams.
- Threats or urgent pressure tactics.
- Fake claims and impersonation.
- Spammy language, links, or formatting.

**Exceptions are made** when the conversation implies a trusted relationship.

---

## ✅ Functional Summary

| FlowiseAI Node     | Node.js Equivalent                |
|--------------------|-----------------------------------|
| Start              | API: `POST /check-message`        |
| ChatOpenAI         | `llm.js` using GPT-4o-mini        |
| SQLite Memory      | `memory.js`                       |
| Agent (Spam logic) | `spamDetector.js`                 |
| State Management   | `state.messages[]` history array  |
| End                | Response returned to client       |

---

## 📝 Notes

- Supports **multi-turn** analysis using full chat context.
- GPT-4o-mini provides rich contextual understanding.
- SQLite ensures scalable memory tracking per session.