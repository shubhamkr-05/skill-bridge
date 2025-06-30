import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {   
  addSessionNote,
  getSessionNotes,
} from "../controllers/sessionNote.controller.js";

const router = Router();

router.route("/session-notes/:sessionId").post(verifyJWT, addSessionNote);
router.route("/session-notes/:sessionId").get(verifyJWT, getSessionNotes);

export default router;