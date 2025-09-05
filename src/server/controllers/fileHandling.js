import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";  
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import s3 from "../config/R2_Bucket.js";
import path from "path";
import { v4 as uuidv4 } from "uuid";

function generateR2Key(fileName) {
  const extName = path.extname(fileName);
  const uniqueId = uuidv4();
  return `${uniqueId}${extName}`;
}

const getUploadUrl = asyncHandler(async (req, res) => {
  const {filename, contentType} = req.body;
  const key = generateR2Key(filename);

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 60 * 4 });

  res.status(200).json(new ApiResponse(200, { signedUploadUrl: url, key: key }, "Upload URL generated successfully"));
});

const getDownloadUrl = asyncHandler(async (req, res) => {
  const { key } = req.query;

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    ResponseContentDisposition: `attachment`,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 * 50 * 4 });

  res.status(200).json(new ApiResponse(200, { signedDownloadUrl: url }, "Download URL generated successfully"));
});

export {
  getUploadUrl, 
  getDownloadUrl
};