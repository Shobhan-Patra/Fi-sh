import Router from "express";
import { getUploadUrl, getDownloadUrl, updateFilesTable, fetchAllSharedFiles } from "../controllers/fileHandling.js";

const router = Router();

router.get("/all/:roomId", fetchAllSharedFiles);
router.post("/upload", getUploadUrl);
router.get("/download", getDownloadUrl);
router.post("/update", updateFilesTable)

export default router;