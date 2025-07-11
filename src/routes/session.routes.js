import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"; 

import {
  createSession,
  getMentorSessions,
  getUserSessions,
  getActiveStudents,
  markSessionAsCompleted,
  getUserUpcomingSessions
} from "../controllers/session.controller.js";

const router = Router();

router.post("/", verifyJWT, createSession);
router.get("/user", verifyJWT, getUserSessions);
router.get("/mentor", verifyJWT, getMentorSessions);
router.get("/mentor/active-students", verifyJWT, getActiveStudents);
router.patch("/:sessionId/complete", verifyJWT, markSessionAsCompleted);
router.get("/user/upcoming", verifyJWT, getUserUpcomingSessions);

export default router;