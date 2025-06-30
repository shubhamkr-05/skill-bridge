import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    sendMessage,
    getSessionChat,
} from "../controllers/chat.controller.js"; 

const router = Router();

router.route("/send").post(verifyJWT, sendMessage);
router.route("/:sessionId").get(verifyJWT, getSessionChat);

export default router;