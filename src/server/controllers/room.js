import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateRoomId } from "../utils/helperFunctions.js";
import db from "../db/db.js";

const createRoom = asyncHandler(async (req, res) => {
  const roomId = generateRoomId();
  const { userId } = req.body;

  const insertRoom = db.prepare(
    "INSERT INTO rooms (id, created_by, created_at, expires_at) VALUES (?, ?, CURRENT_TIMESTAMP, datetime('now', '+1 day'))"
  );
  const updateUser = db.prepare("UPDATE users SET room_id = ? WHERE id = ?");

  try {
    const insertRoomResult = insertRoom.run(roomId, userId);
    const user = updateUser.run(roomId, userId);
    if (user.changes === 0) {
      throw new ApiError(400, "User is already in a room");
    }
    if (insertRoomResult.changes === 0) {
      throw new Error("Failed to create new Room");
    }

    // const participants = getAllParticipants(roomId);

    deleteExpiredRooms();

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          roomId,
          // fileData: [],
          // participants: participants,
        },
        "Room created successfully"
      )
    );
  } catch (error) {
    console.log("Error creating room: ", error);
    throw new ApiError(400, "DB error");
  }
});

const joinRoom = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;
  const { userId } = req.body;
  console.log(roomId, userId);

  try {
    const updateUser = db.prepare("UPDATE users SET room_id = ? WHERE id = ?");
    const user = updateUser.run(roomId, userId);
    if (user.changes === 0) {
      throw new ApiError(400, "User is already in a room");
    }

    // const fileData = getAllSharedFiles(roomId);
    // const participants = getAllParticipants(roomId);

    deleteExpiredRooms();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          // { fileData, participants },
          {},
          "User joined room successfully and files fetched successfully"
        )
      );
  } catch (error) {
    console.log("Error joining room: ", error);
    throw new ApiError(400, "User DB error");
  }
});

const leaveRoom = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const removeRoomId = db.prepare(
    "UPDATE users SET room_id = NULL WHERE id = ?"
  );

  try {
    const result = removeRoomId.run(userId);
    if (result.changes === 0) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User left room successfully"));
  } catch (error) {
    console.log("Error leaving room: ", error);
    throw new ApiError(400, "Error leaving room");
  }
});

// Use lazy-cleanup i.e Delete records only when someone queries rooms table
const deleteExpiredRooms = () => {
  const deleteRoom = db.prepare(
    "DELETE FROM rooms WHERE expires_at <= datetime('now')"
  );

  try {
    const result = deleteRoom.run();
    if (result.changes === 0) {
      console.log("Lazy cleanup not needed");
    }
    else {
      console.log("Lazy cleanup of rooms occured");
    }
  } catch (error) {
    console.log("Error while deleting room: ", error);
    throw new ApiError(400, "DB error");
  }
};

export { createRoom, joinRoom, leaveRoom };
