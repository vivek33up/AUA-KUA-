import express from "express";

import {
  listApplications,
  getApplicationDetails,
} from "../controllers/adminController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.get("/applications", authenticateToken, requireRole("admin"), listApplications);
router.get(
  "/applications/:id",
  authenticateToken,
  requireRole("admin"),
  getApplicationDetails,
);

export default router;
