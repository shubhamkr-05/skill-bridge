import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getUserNotifications,
  markAsRead,
  getUnseenNotificationCount,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/notifications").get(verifyJWT, getUserNotifications);
router.route("/notifications/:notificationId/read").patch(verifyJWT, markAsRead);
router.get("/notifications/unseen-count", verifyJWT, getUnseenNotificationCount);

export default router;