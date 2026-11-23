import express from "express";
import {
  generateStudyPlan,
  getStudyPlans,
  updateStudyTask,
} from "../controllers/studyPlannerController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getStudyPlans);
router.post("/generate", generateStudyPlan);
router.patch("/:planId/tasks", updateStudyTask);

export default router;
