import Router from "express";
import { getUploadUrl, getDownloadUrl, updateFilesTable } from "../controllers/fileHandling.js";

const router = Router();

router.post("/upload", getUploadUrl);
router.get("/download", getDownloadUrl);
router.post("/update", updateFilesTable)

export default router;