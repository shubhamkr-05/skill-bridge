import express from "express";
import {
  getUserChats,
  getMessages,
  createMessage,
  getContacts,
  createChat,
} from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/chats", verifyJWT, getUserChats);
router.get("/messages/:chatId", verifyJWT, getMessages);
router.post("/message",verifyJWT, upload.fields([{ name: "file", maxCount: 1 }]), createMessage);
router.get("/contacts", verifyJWT, getContacts);
router.post("/create", verifyJWT, createChat);

export default router;
