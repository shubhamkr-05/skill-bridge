import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserProfile,
  getMentors,
  getMentorById,
} from "../controllers/user.controller.js";
import {
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import {
  createSession,
  getMentorSessions,
  getUserSessions,
} from "../controllers/session.controller.js";
import {
  sendMessage,
  getSessionChat,
} from "../controllers/chat.controller.js";
import {
  createPaymentRecord,
  updatePaymentStatus,
  getUserPayments,
} from "../controllers/payment.controller.js";
import {
  submitRating,
  getMentorRatings,
} from "../controllers/rating.controller.js";
import {
  getUserNotifications,
  markAsRead,
  getUnseenNotificationCount,
} from "../controllers/notification.controller.js";
import {
  addSessionNote,
  getSessionNotes,
} from "../controllers/sessionNote.controller.js";


const router = Router();

// ========== AUTH & USER ==========
router.route("/register").post(
  upload.single("avatar"),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/update-profile").patch(verifyJWT,upload.single("avatar"), updateUserProfile);

// ========== MENTORS ==========
router.route("/mentors").get(getMentors);
router.route("/mentors/:mentorId").get(getMentorById);

// ========== APPOINTMENTS ==========
router.route("/appointments").post(verifyJWT, createAppointment);
router.route("/appointments").get(verifyJWT, getUserAppointments);
router.route("/appointments/:id/status").patch(verifyJWT, updateAppointmentStatus);

// ========== SESSIONS ==========
router.route("/sessions/schedule").post(verifyJWT, authorizeRoles("mentor"), createSession);
router.route("/sessions-mentors").get(verifyJWT, getMentorSessions);
router.route("/sessions-users").get(verifyJWT, getUserSessions);


// ========== CHATS ==========
router.route("/send").post(verifyJWT, sendMessage);
router.route("/:sessionId").get(verifyJWT, getSessionChat);

// ========== PAYMENTS ==========
router.route("/").post(verifyJWT, createPaymentRecord);
router.route("/:paymentId").patch(verifyJWT, updatePaymentStatus);
router.route("/").get(verifyJWT, getUserPayments);

// ========== RATINGS ==========
router.route("/ratings").post(verifyJWT, submitRating);
router.route("/ratings/:mentorId").get(verifyJWT, getMentorRatings);

// ========== NOTIFICATIONS ==========
router.route("/notifications").get(verifyJWT, getUserNotifications);
router.route("/notifications/:notificationId/read").patch(verifyJWT, markAsRead);
router.get("/notifications/unseen-count", verifyJWT, getUnseenNotificationCount);


// ========== SESSION NOTES ==========
router.route("/session-notes/:sessionId").post(verifyJWT, addSessionNote);
router.route("/session-notes/:sessionId").get(verifyJWT, getSessionNotes);

export default router;
