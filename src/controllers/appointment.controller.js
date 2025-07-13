import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Notification } from "../models/notification.model.js";

// Create appointment after payment success
const createAppointment = asyncHandler(async (req, res) => {
  const { mentorId, skill, fee } = req.body;
  if (!mentorId || !skill || !fee) throw new ApiError(400, "All fields required");

  const appointment = await Appointment.create({
    mentor: mentorId,
    user: req.user._id,
    skill,
    fee,
  });

  await Notification.create({
    user: mentorId,
    message: `${req.user.fullName} booked a course for ${skill}`,
    type: "appointment_booked",
    link: `/appointments/${appointment._id}`,
  });

  res.status(201).json(new ApiResponse(201, appointment, "Appointment booked"));
});

// Get all appointments where user is involved
const getUserAppointments = asyncHandler(async (req, res) => {  
  const data = await Appointment.find({
    $or: [{ user: req.user._id }, { mentor: req.user._id }],
  })
    .populate("mentor user")
    .populate("session")
    .populate("skill");

  res.status(200).json(new ApiResponse(200, data));
});

// Controller for GET /appointments/my-courses
const getMyCourses = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate('mentor', 'fullName avatar')
    .populate('session'); // ✅ populate session here

  res.status(200).json(new ApiResponse(200, appointments));
});


// Get mentor's active (scheduled) students
const getMyStudents = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    mentor: req.user._id,
    sessionStatus: "scheduled",
  }).populate("user", "fullName avatar");

  res.status(200).json(new ApiResponse(200, data, "Scheduled students fetched"));
});

// Appointment history for user
const getAppointmentHistoryForUser = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id })
    .populate("mentor", "fullName avatar")
    .populate("session");

  res.status(200).json(new ApiResponse(200, appointments));
});

// Appointment history for mentor
const getAppointmentHistoryForMentor = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ mentor: req.user._id })
    .populate("user", "fullName avatar")
    .populate("session");

  res.status(200).json(new ApiResponse(200, appointments));
});

const getUnscheduledAppointmentsForMentor = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    mentor: req.user._id,
    sessionStatus: 'notScheduled'
  }).populate("user", "fullName avatar");

  res.status(200).json(new ApiResponse(200, data));
});


export {
  createAppointment,
  getUserAppointments,
  getMyCourses,
  getMyStudents,
  getAppointmentHistoryForUser,
  getAppointmentHistoryForMentor,
  getUnscheduledAppointmentsForMentor,
};
