import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import s3 from "../config/R2_Bucket.js";
import path from "path";
import db from "../db/db.js";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../utils/ApiError.js";

function generateR2Key(fileName) {
  const extName = path.extname(fileName);
  const uniqueId = uuidv4();
  return `${uniqueId}${extName}`;
}

const getUploadUrl = asyncHandler(async (req, res) => {
  const { roomId, userId, filename, fileSize, contentType } = req.body;
  const fileId = uuidv4();
  const key = generateR2Key(filename);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 4 });

  const insertFileData = db.prepare(
    "INSERT INTO files (id, room_id, uploaded_by, file_name, file_size, mime_type) VALUES (?, ?, ?, ?, ?, ?)"
  );

  try {
    const result = insertFileData.run(
      fileId,
      roomId,
      userId,
      filename,
      fileSize,
      contentType
    );
    if (result.changes === 0) {
      throw new Error("No changes made");
    }
  } catch (error) {
    console.log("Error while saving file metadata: ", error);
    throw new ApiError(400, "Error while saving file metadata");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { signedUploadUrl: uploadUrl, key: key },
        "Upload URL generated successfully"
      )
    );
});

const getDownloadUrl = asyncHandler(async (req, res) => {
  const { key } = req.query;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment`,
  });

  const downloadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 50 * 4 });

  const updateFileStorageUrl = db.prepare(
    "UPDATE users SET storage_url = ? WHERE id = ?"
  );

  try {
    const result = updateFileStorageUrl.run(downloadUrl, fileId);
    if (result.changes === 0) {
      throw new Error("No changes made");
    }
  } catch (error) {
    console.log("Error while saving file metadata: ", error);
    throw new ApiError(400, "Error while saving file metadata");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { signedDownloadUrl: downloadUrl },
        "Download URL generated successfully"
      )
    );
});

export { getUploadUrl, getDownloadUrl };
