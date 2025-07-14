import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js"; 

import {
  createSession,
  getMentorSessions,
  getUserSessions
} from "../controllers/session.controller.js";

const router = Router();

router.post("/", verifyJWT, createSession);
router.get("/user", verifyJWT, getUserSessions);
router.get("/mentor", verifyJWT, getMentorSessions);

export default router;