import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markAsRead,
  getUnseenNotificationCount,
  markAllAsRead
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(verifyJWT, getUserNotifications);
router.route("/mark-all-read").get(verifyJWT, markAllAsRead);
router.route("/:notificationId/read").patch(verifyJWT, markAsRead);
router.get("/unseen-count", verifyJWT, getUnseenNotificationCount);

export default router;