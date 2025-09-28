import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import db from "../db/db.js";
import { generateRandomUserName } from "../utils/helperFunctions.js";
import { randomUUID } from "crypto";

const createUser = asyncHandler(async (req, res) => {
  const userId = randomUUID();
  const displayName = generateRandomUserName();

  const insertUser = db.prepare(
    "INSERT INTO users (id, display_name) VALUES (?, ?)"
  );
  const getUser = db.prepare("SELECT * FROM users WHERE id = ?");

  try {
    const result = insertUser.run(userId, displayName);
    if (result.changes === 0) {
      throw new Error("No changes made to user table");
    }

    deleteExpiredUsers();

    const userRow = getUser.get(userId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          userRow,
          "User created successfully"
        )
      );
  } catch (error) {
    console.log("Error creating user: ", error);
    throw new ApiError(400, "Error creating user");
  }
});

// Use lazy-cleanup i.e Delete records only when someone queries users table
const deleteExpiredUsers = () => {
  const deleteUser = db.prepare(
    "DELETE FROM users WHERE joined_at <= datetime('now', '-7 days')"
  );

  try {
    const result = deleteUser.run();
    console.log("Lazy cleanup of users occured");

  } catch (error) {
    console.log("Error while deleting expired user: ", error);
    throw new ApiError(400, "DB error");
  }
};

export { createUser };