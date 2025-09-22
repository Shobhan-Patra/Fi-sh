import Database from "better-sqlite3";

const DB_FILE = process.env.DB_FILE;

const db = new Database(DB_FILE);

db.pragma("foreign_keys = ON");

db.exec(`
PRAGMA journal_mode = WAL; -- better concurrency for writers/readers (optional)
CREATE TABLE IF NOT EXISTS rooms (
  id TEXT PRIMARY KEY,
  created_by TEXT, --for admin privileges
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  expires_at DATETIME DEFAULT datetime('now', '+1 day'),
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  room_id TEXT, --this user belongs to this roomId
  display_name TEXT NOT NULL,
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP, --for deleting users after a certain interval
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id TEXT NOT NULL, --file was uploaded in this room
  uploaded_by TEXT, --user id reference
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  storage_url TEXT NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);
`);

export default db;
