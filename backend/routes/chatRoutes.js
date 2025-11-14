import express from "express";
import { sendMessage } from "../controllers/chatController.js";
import { protect, patientOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Send message to chatbot (patients only)
router.post("/", protect, patientOnly, sendMessage);

export default router;
