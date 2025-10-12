import db from '../db/db.js';

// Lists all the participants in a room
const getAllParticipants = async (roomId) => {
  // const getUsers = db.prepare('SELECT * FROM users WHERE room_id = (?)');
  // const users = getUsers.all(roomId);

  const users = await db.execute({
    sql: 'SELECT * FROM users WHERE room_id = (?)',
    args: [roomId],
  });

  return users.rows;
};

// display all the files shared in that room
const getAllSharedFiles = async (roomId) => {
  // const readFiles = db.prepare('SELECT * FROM files WHERE room_id = (?)');
  // const fileData = readFiles.all(roomId);

  const fileData = await db.execute({
    sql: 'SELECT * FROM files WHERE room_id = (?)',
    args: [roomId],
  });

  return fileData.rows;
};

export { getAllParticipants, getAllSharedFiles };
