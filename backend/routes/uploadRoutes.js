import express from "express";

import { uploadFile } from "../controllers/uploadController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";
import { upload } from "../config/upload.js";

const router = express.Router();

router.post("/", authenticateToken, requireRole("user"), upload.single("file"), uploadFile);

export default router;
