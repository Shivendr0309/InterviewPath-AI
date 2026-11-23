import express from "express";
import { runCode, submitCode, getSubmissionHistory } from "../controllers/submissionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/history", authMiddleware, getSubmissionHistory);
router.post("/run/:id", authMiddleware, runCode);
router.post("/:id", authMiddleware, submitCode);

export default router;