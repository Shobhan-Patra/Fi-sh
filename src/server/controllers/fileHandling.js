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

function generateR2Key(fileName) {
  const extName = path.extname(fileName);
  const uniqueId = uuidv4();
  return `${uniqueId}${extName}`;
}

const getUploadUrl = asyncHandler(async (req, res) => {
  const { filename, contentType } = req.body;
  const key = generateR2Key(filename);

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
  const { roomId, userId, filename, fileSize, contentType, downloadUrl } =
    req.body;
  const fileId = uuidv4();

  const insertFileData = db.prepare(
    'INSERT INTO files (id, room_id, uploaded_by, file_name, file_size, mime_type, storage_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  try {
    const result = insertFileData.run(
      fileId,
      roomId,
      userId,
      filename,
      fileSize,
      contentType,
      downloadUrl
    );
    if (result.changes === 0) {
      throw new Error('No changes made');
    }

    deleteExpiredFileEntries();

    return res
      .status(200)
      .json(new ApiResponse(200, null, 'Files table updated successfully'));
  } catch (error) {
    console.log('Error while saving file metadata: ', error);
    throw new ApiError(400, 'Error while saving file metadata');
  }
});

const fetchSharedFilesAndRoomParticipants = asyncHandler(async (req, res) => {
  const roomId = req.params.roomId;
  const userId = req.params.userId;
  console.log(userId);
  const IsUserInRoom = db.prepare(
    'SELECT id FROM users WHERE room_id = (?) AND id = (?)'
  );
  try {
    const user = IsUserInRoom.get(roomId, userId);
    if (!user) {
      throw new ApiError(
        403,
        'User is not a participant of this room, Access restricted'
      );
    }
    const fileData = getAllSharedFiles(roomId);
    const participants = getAllParticipants(roomId);

    deleteExpiredFileEntries();

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

const deleteExpiredFileEntries = () => {
  const deleteFileEntry = db.prepare(
    "DELETE FROM files WHERE uploaded_at <= datetime('now', '-24 hours')"
  );

  try {
    const result = deleteFileEntry.run();
    if (result.changes === 0) {
      console.log('Lazy cleanup not needed');
    } else {
      console.log(`Cleaned up ${result.changes} expired file records.`);
    }
  } catch (error) {
    console.log('Error while deleting file entry: ', error);
    throw new ApiError(400, 'Error during lazy cleanup of files');
  }
};

export {
  getUploadUrl,
  getDownloadUrl,
  updateFilesTable,
  fetchSharedFilesAndRoomParticipants,
};
