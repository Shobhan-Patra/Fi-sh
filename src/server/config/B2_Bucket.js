import { S3Client } from "@aws-sdk/client-s3";  
import dotenv from "dotenv";

dotenv.config();

const s3 = new S3Client({
  region: "eu-central-003", 
  endpoint: process.env.B2_ENDPOINT, 
  credentials: {
    accessKeyId: process.env.B2_KEY_ID, 
    secretAccessKey: process.env.B2_SECRET_KEY, 
  },
});

export default s3;