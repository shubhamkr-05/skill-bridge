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
  getMentorAppointmentStudents,
  getStudentAppointmentMentors
} from "../controllers/appointment.controller.js";  

const router = Router();

router.route("/").post(verifyJWT, createAppointment);
router.route("/").get(verifyJWT, getUserAppointments);
router.get('/my-courses', verifyJWT, getMyCourses);
router.get('/my-students', verifyJWT, getMyStudents);
router.get("/not-scheduled", verifyJWT, authorizeRoles("mentor"), getUnscheduledAppointmentsForMentor);
router.get("/history/user", verifyJWT, getAppointmentHistoryForUser);
router.get("/history/mentor", verifyJWT, authorizeRoles("mentor"), getAppointmentHistoryForMentor);
router.get("/mentor/students", verifyJWT, getMentorAppointmentStudents);
router.get("/student/mentors", verifyJWT, getStudentAppointmentMentors);

export default router;