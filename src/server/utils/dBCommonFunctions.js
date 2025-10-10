import db from '../db/db.js';

// Lists all the participants in a room
const getAllParticipants = (roomId) => {
  const getUsers = db.prepare('SELECT * FROM users WHERE room_id = (?)');
  const users = getUsers.all(roomId);
  return users;
};

// display all the files shared in that room
const getAllSharedFiles = (roomId) => {
  const readFiles = db.prepare('SELECT * FROM files WHERE room_id = (?)');
  const fileData = readFiles.all(roomId);
  return fileData;
};

export { getAllParticipants, getAllSharedFiles };
