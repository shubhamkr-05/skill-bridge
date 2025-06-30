import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {   
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/appointments").post(verifyJWT, createAppointment);
router.route("/appointments").get(verifyJWT, getUserAppointments);
router.route("/appointments/:id/status").patch(verifyJWT, updateAppointmentStatus);

export default router;