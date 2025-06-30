import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"; 

import {
  createSession,
  getMentorSessions,
  getUserSessions,
} from "../controllers/session.controller.js";

const router = Router();

router.route("/sessions/schedule").post(verifyJWT, authorizeRoles("mentor"), createSession);
router.route("/sessions-mentors").get(verifyJWT, getMentorSessions);
router.route("/sessions-users").get(verifyJWT, getUserSessions);

export default router;