import express from "express";

import {
  signup,
  login,
  recoverAdminId,
  completeReset,
  resetPassword,
  requestPasswordReset,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/add-user", signup);
router.post("/login", login);
router.post("/recover-admin-id", recoverAdminId);
router.post("/complete-reset", completeReset);
router.post("/reset-password", resetPassword);
router.post("/request-reset", requestPasswordReset);

export default router;
