import express from "express";

import { listForms, getFormStructure } from "../controllers/formsController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authenticateToken, listForms);
router.get("/:formId", authenticateToken, getFormStructure);

export default router;
