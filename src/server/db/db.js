import { createClient } from '@libsql/client';

const TURSO_DB_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

if (!TURSO_DB_URL || !TURSO_AUTH_TOKEN) {
  throw new Error('Turso database URL and auth token are required.');
}

const db = createClient({
  url: TURSO_DB_URL,
  authToken: TURSO_AUTH_TOKEN,
});

const initializeSchema = async () => {
  try {
    await db.batch([
      `PRAGMA foreign_keys = OFF; --Disable foreign key checks to prevent the circular foreign key dependency`,
      `CREATE TABLE IF NOT EXISTS rooms (
       id TEXT PRIMARY KEY,
       created_by TEXT,
       created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
       expires_at DATETIME DEFAULT (datetime('now', '+1 day')),
       FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
     );`,
      ` CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      room_id TEXT,
      display_name TEXT NOT NULL,
      joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE SET NULL
    );`,
      `CREATE TABLE IF NOT EXISTS files (
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
    );`,
      `PRAGMA foreign_keys = ON; -- Re-enable foreign key checks`,
    ]);
    console.log('Database schema initialized.');
  } catch (error) {
    console.error('Failed to initialize database schema: ', error);
    process.exit(1);
  }
};

await initializeSchema();

export default db;
