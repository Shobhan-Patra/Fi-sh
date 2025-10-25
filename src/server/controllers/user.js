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

  try {
    const result = await db.execute({
      sql: 'INSERT INTO users (id, display_name) VALUES (?, ?) RETURNING *',
      args: [userId, displayName],
    });

    if (result.rowsAffected === 0) {
      throw new Error('No changes made to user table');
    }

    return res
      .status(201)
      .json(new ApiResponse(200, result.rows[0], 'User created successfully'));
  } catch (error) {
    console.log('Error creating user: ', error);
    throw new ApiError(400, 'Error creating user');
  }
});

const getRoomId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const result = await db.execute({
      sql: 'SELECT room_id FROM users WHERE id = (?)',
      args: [userId],
    });

    if (result.rows.length === 0) {
      throw new ApiError('User not found');
    }

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
