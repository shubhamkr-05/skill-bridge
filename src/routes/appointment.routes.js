import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {   
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/").post(verifyJWT, createAppointment);
router.route("/").get(verifyJWT, getUserAppointments);
router.route("/:id/status").patch(verifyJWT, updateAppointmentStatus);

export default router;