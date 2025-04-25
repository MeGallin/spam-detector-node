import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('spam_agent.db');

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
        sessionId TEXT PRIMARY KEY,
        state TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

export async function saveState(sessionId, state) {
  return new Promise((resolve, reject) => {
    const query =
      'INSERT OR REPLACE INTO sessions (sessionId, state) VALUES (?, ?)';
    db.run(query, [sessionId, JSON.stringify(state)], (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export async function getState(sessionId) {
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT state FROM sessions WHERE sessionId = ?',
      [sessionId],
      (err, row) => {
        if (err) reject(err);
        else resolve(row ? JSON.parse(row.state) : null);
      },
    );
  });
}
