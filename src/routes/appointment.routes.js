import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {   
  createAppointment,
  getUserAppointments,
  updateAppointmentStatus,
  getMyCourses,
  getMyStudents
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/").post(verifyJWT, createAppointment);
router.route("/").get(verifyJWT, getUserAppointments);
router.route("/:id/status").patch(verifyJWT, updateAppointmentStatus);
router.get('/my-courses', verifyJWT, getMyCourses);
router.get('/my-students', verifyJWT, getMyStudents);

export default router;