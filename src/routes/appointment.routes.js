import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {   
  createAppointment,
  getUserAppointments,
  getMentorAppointmentStudents,
  getStudentAppointmentMentors
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/").post(verifyJWT, createAppointment);
router.route("/").get(verifyJWT, getUserAppointments);
router.get("/mentor/students", verifyJWT, getMentorAppointmentStudents);
router.get("/student/mentors", verifyJWT, getStudentAppointmentMentors);

export default router;