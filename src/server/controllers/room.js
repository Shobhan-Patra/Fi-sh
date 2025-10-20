import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';
import { generateRoomId } from '../utils/helperFunctions.js';
import db from '../db/db.js';

const createRoom = asyncHandler(async (req, res) => {
  const roomId = generateRoomId();
  const { userId } = req.body;

  try {
    const insertRoomResult = await db.execute({
      sql: "INSERT INTO rooms (id, created_by, created_at, expires_at) VALUES (?, ?, CURRENT_TIMESTAMP, datetime('now', '+1 day'))",
      args: [roomId, userId],
    });

    const user = await db.execute({
      sql: 'UPDATE users SET room_id = ? WHERE id = ?',
      args: [roomId, userId],
    });

    if (user.rowsAffected === 0) {
      throw new ApiError(400, 'User is already in a room');
    }
    if (insertRoomResult.rowsAffected === 0) {
      throw new Error('Failed to create new Room');
    }

    await deleteExpiredRooms();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          roomId,
        },
        'Room created successfully'
      )
    );
  } catch (error) {
    console.log('Error creating room: ', error);
    throw new ApiError(400, 'DB error');
  }
});

const joinRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;
  const { userId } = req.body;

  console.log(roomId, "-", userId);

  try {
    const user = await db.execute({
      sql: 'UPDATE users SET room_id = ? WHERE id = ? RETURNING *',
      args: [roomId, userId],
    });

    if (user.rowsAffected === 0) {
      throw new ApiError(400, 'User is already in a room');
    }

    req.io.to(roomId).emit('user-joined', {
        user: user.rows[0]
    })

    await deleteExpiredRooms();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          'User joined room successfully and files fetched successfully'
        )
      );
  } catch (error) {
    console.log('Error joining room: ', error);
    throw new ApiError(400, 'User DB error');
  }
});

const leaveRoom = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db.execute({
      sql: 'SELECT display_name, room_id FROM users WHERE id = ?',
      args: [userId],
    });

    const result = await db.execute({
      sql: 'UPDATE users SET room_id = NULL WHERE id = ?',
      args: [userId],
    });

    if (user.rows.length === 0 || result.rowsAffected === 0) {
      throw new ApiError(404, 'User not found');
    }

    const { display_name, room_id } = user.rows[0];
    req.io.to(room_id).emit('user-left', {
      userId: userId,
      display_name: display_name,
    })

    await deleteExpiredRooms();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'User left room successfully'));
  } catch (error) {
    console.log('Error leaving room: ', error);
    throw new ApiError(400, 'Error leaving room');
  }
});

// Use lazy-cleanup i.e. Delete records only when someone queries rooms table
const deleteExpiredRooms = async () => {
  try {
    const result = await db.execute({
      sql: "DELETE FROM rooms WHERE expires_at <= datetime('now')",
      args: [],
    });

    if (result.rowsAffected > 0) {
      console.log(`Cleaned up ${result.changes} expired room records.`);
    }
  } catch (error) {
    console.log('Error while deleting room: ', error);
    throw new ApiError(400, 'DB error');
  }
};

export { createRoom, joinRoom, leaveRoom };
