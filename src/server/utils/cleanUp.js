import db from '../db/db.js';

// Use lazy-cleanup i.e. Delete records only when someone queries rooms table

const deleteExpiredRooms = async () => {
  try {
    const result = await db.execute({
      sql: "DELETE FROM rooms WHERE expires_at <= datetime('now')",
      args: [],
    });

    if (result.rowsAffected > 0) {
      console.log(
        `Cleaned up ${result.changes} expired room records and their file entries.`
      );
    }
  } catch (error) {
    console.error('Error while deleting room: ', error);
  }
};

const deleteExpiredUsers = async () => {
  try {
    const result = await db.execute({
      sql: "DELETE FROM users WHERE joined_at <= datetime('now', '-1 day')",
      args: [],
    });

    if (result.rowsAffected > 0) {
      console.log(`Cleaned up ${result.rowsAffected} expired user records.`);
    }
  } catch (error) {
    console.error('Error while deleting expired user: ', error);
  }
};

export const startCleanUp = async () => {
  console.log('Cleaning Up...');
  await deleteExpiredUsers();
  await deleteExpiredRooms();
  console.log('Finished cleaning up');
};
