import Database from 'better-sqlite3';

const DB_FILE = process.env.DB_FILE;

const db = new Database(DB_FILE);

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = OFF; --Disable foreign key checks to prevent the circular foreign key dependency

  BEGIN TRANSACTION;

  CREATE TABLE IF NOT EXISTS rooms (
    id TEXT PRIMARY KEY,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME DEFAULT (datetime('now', '+1 day')),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    room_id TEXT,
    display_name TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    uploaded_by TEXT,
    file_name TEXT NOT NULL,
    file_size TEXT,
    mime_type TEXT,
    storage_url TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
  );

  COMMIT;

  PRAGMA foreign_keys = ON; -- Re-enable foreign key checks
`);

export default db;
