import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import s3 from '../config/R2_Bucket.js';
import path from 'path';
import db from '../db/db.js';
import {
  getAllParticipants,
  getAllSharedFiles,
} from '../utils/dBCommonFunctions.js';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../utils/ApiError.js';

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

function generateR2Key(fileName) {
  const extName = path.extname(fileName);
  const uniqueId = uuidv4();
  return `${uniqueId}${extName}`;
}

const getUploadUrl = asyncHandler(async (req, res) => {
  const { filename, filesize, contentType } = req.body;
  const key = generateR2Key(filename);

  if (filesize > MAX_FILE_SIZE_BYTES) {
    throw new ApiError(
      413,
      `File is larger than Maximum allowed file size: ${MAX_FILE_SIZE_BYTES}`
    );
  }

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 1 }); // link expires in 1 hour

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { signedUploadUrl: uploadUrl, key: key },
        'Upload URL generated successfully'
      )
    );
});

const getDownloadUrl = asyncHandler(async (req, res) => {
  const { key, filename } = req.query;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${filename}"`,
  });

  const downloadUrl = await getSignedUrl(s3, command, {
    expiresIn: 60 * 60 * 4, // valid for 4 hours
  });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { signedDownloadUrl: downloadUrl },
        'Download URL generated successfully'
      )
    );
});

const updateFilesTable = asyncHandler(async (req, res) => {
  const { fileData, display_name } = req.body;
  const senderSocketId = req.get('X-Socket-Id');
  const fileId = uuidv4();

  try {
    const newFileInsertResult = await db.execute({
      sql: 'INSERT INTO files (id, room_id, uploaded_by, file_name, file_size, mime_type, storage_url) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
      args: [
        fileId,
        fileData.roomId,
        fileData.userId,
        fileData.filename,
        fileData.fileSize,
        fileData.contentType,
        fileData.downloadUrl,
      ],
    });

    if (newFileInsertResult.rowsAffected === 0) {
      throw new Error('No changes made');
    }

    const newFileRow = newFileInsertResult.rows[0];

    req.io.to(fileData.roomId).except(senderSocketId).emit('file:upload', {
      fileData: newFileRow,
      display_name: display_name,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, newFileRow, 'Files table updated successfully')
      );
  } catch (error) {
    console.log('Error while saving file metadata: ', error);
    throw new ApiError(400, 'Error while saving file metadata');
  }
});

const fetchSharedFilesAndRoomParticipants = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;
  try {
    const user = await db.execute({
      sql: 'SELECT id FROM users WHERE room_id = (?) AND id = (?)',
      args: [roomId, userId],
    });

    if (!user || user.rows.length === 0) {
      throw new ApiError(
        403,
        'User is not a participant of this room, Access restricted'
      );
    }
    const fileData = await getAllSharedFiles(roomId);
    const participants = await getAllParticipants(roomId);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { fileData, participants },
          'Fetched shared files successfully'
        )
      );
  } catch (error) {
    console.log('Failed to fetch shared files');
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(401, 'Failed to fetch shared files');
  }
});

// const deleteExpiredFileEntries = async () => {
//   // const deleteFileEntry = db.prepare(
//   //   "DELETE FROM files WHERE uploaded_at <= datetime('now', '-24 hours')"
//   // );
//
//   try {
//     // const result = deleteFileEntry.run();
//
//     const result = await db.execute({
//       sql: "DELETE FROM files WHERE uploaded_at <= datetime('now', '-24 hours')",
//       args: [],
//     });
//
//     if (result.rowsAffected > 0) {
//       console.log(`Cleaned up ${result.rowsAffected} expired file records.`);
//     }
//   } catch (error) {
//     console.log('Error while deleting file entry: ', error);
//     throw new ApiError(400, 'Error during lazy cleanup of files');
//   }
// };

export {
  getUploadUrl,
  getDownloadUrl,
  updateFilesTable,
  fetchSharedFilesAndRoomParticipants,
};
