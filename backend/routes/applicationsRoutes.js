import express from "express";

import {
  startApplication,
  saveAnswers,
  submitApplication,
} from "../controllers/applicationsController.js";
import { authenticateToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/start",
  authenticateToken,
  requireRole("user"),
  startApplication,
);

router.post(
  "/:id/answers",
  authenticateToken,
  requireRole("user"),
  saveAnswers,
);

router.post(
  "/:id/submit",
  authenticateToken,
  requireRole("user"),
  submitApplication,
);

export default router;
