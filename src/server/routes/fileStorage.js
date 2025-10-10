import Router from "express";
import { getUploadUrl, getDownloadUrl, updateFilesTable, fetchSharedFilesAndRoomParticipants } from "../controllers/fileHandling.js";

const router = Router();

router.get("/data/:roomId/:userId", fetchSharedFilesAndRoomParticipants);
router.post("/upload", getUploadUrl);
router.get("/download", getDownloadUrl);
router.post("/update", updateFilesTable)

export default router;