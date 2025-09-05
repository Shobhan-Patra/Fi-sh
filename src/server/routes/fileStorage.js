import Router from "express";
import { getUploadUrl, getDownloadUrl } from "../controllers/fileHandling.js";

const router = Router();

router.post("/upload", getUploadUrl);
router.get("/download", getDownloadUrl);

export default router;