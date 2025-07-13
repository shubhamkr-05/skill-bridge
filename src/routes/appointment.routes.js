import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";
import {   
  createAppointment,
  getUserAppointments,
  getMyCourses,
  getMyStudents,
  getUnscheduledAppointmentsForMentor,
  getAppointmentHistoryForUser,
  getAppointmentHistoryForMentor,
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/").post(verifyJWT, createAppointment);
router.route("/").get(verifyJWT, getUserAppointments);
router.get('/my-courses', verifyJWT, getMyCourses);
router.get('/my-students', verifyJWT, getMyStudents);
router.get("/not-scheduled", verifyJWT, authorizeRoles("mentor"), getUnscheduledAppointmentsForMentor);


export default router;