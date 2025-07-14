import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getUserNotifications);
router.route("/read/:notificationId").patch(verifyJWT, markAsRead);

export default router;