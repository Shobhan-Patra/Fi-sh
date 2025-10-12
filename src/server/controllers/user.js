import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import db from '../db/db.js';
import { generateRandomUserName } from '../utils/helperFunctions.js';
import { randomUUID } from 'crypto';

const createUser = asyncHandler(async (req, res) => {
  const userId = randomUUID();
  const displayName = generateRandomUserName();
  console.log(displayName);

  // const insertUser = db.prepare(
  //   'INSERT INTO users (id, display_name) VALUES (?, ?)'
  // );
  // const getUser = db.prepare('SELECT * FROM users WHERE id = ?');

  try {
    // const result = insertUser.run(userId, displayName);

    const result = await db.execute({
      sql: 'INSERT INTO users (id, display_name) VALUES (?, ?)',
      args: [userId, displayName],
    });

    if (result.rowsAffected === 0) {
      throw new Error('No changes made to user table');
    }

    await deleteExpiredUsers();

    // const userRow = getUser.get(userId);

    const userRow = await db.execute({
      sql: 'SELECT * FROM users WHERE id = ?',
      args: [userId],
    });

    return res
      .status(201)
      .json(new ApiResponse(200, userRow.rows[0], 'User created successfully'));
  } catch (error) {
    console.log('Error creating user: ', error);
    throw new ApiError(400, 'Error creating user');
  }
});

// Use lazy-cleanup i.e Delete records only when someone queries users table
const deleteExpiredUsers = async () => {
  // const deleteUser = db.prepare(
  //   "DELETE FROM users WHERE joined_at <= datetime('now', '-7 days')"
  // );

  try {
    // const result = deleteUser.run();

    const result = await db.execute({
      sql: "DELETE FROM users WHERE joined_at <= datetime('now', '-7 days')",
      args: [],
    });

    if (result.rowsAffected > 0) {
      console.log(`Cleaned up ${result.rowsAffected} expired user records.`);
    }
  } catch (error) {
    console.log('Error while deleting expired user: ', error);
    throw new Error('Error while lazy cleanup');
  }
};

const getRoomId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  // const getRoomId = db.prepare('SELECT room_id FROM users WHERE id = (?)');

  try {
    // const result = getRoomId.get(userId);

    const result = await db.execute({
      sql: 'SELECT room_id FROM users WHERE id = (?)',
      args: [userId],
    });

    if (result.rows.length === 0) {
      throw new ApiError('User not found');
    }

    await deleteExpiredUsers();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { roomId: result.rows[0].room_id },
          'Room Id fetched succesfully'
        )
      );
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error);
  }
});

export { createUser, getRoomId };
