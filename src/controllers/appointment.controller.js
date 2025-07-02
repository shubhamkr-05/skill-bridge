import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Notification } from "../models/notification.model.js";

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
    message: `${req.user.fullName} requested an appointment for ${skill}`,
    type: "appointment_request",
    link: `/appointments/${appointment._id}`,
  });

  res.status(201).json(new ApiResponse(201, appointment, "Appointment requested"));
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(id).populate("user mentor");
  if (!appointment) throw new ApiError(404, "Appointment not found");

  appointment.status = status;
  if (status === "accepted") appointment.acceptedAt = new Date();
  await appointment.save();

  await Notification.create({
    user: appointment.user._id,
    message: `Your appointment was ${status} by ${appointment.mentor.fullName}`,
    type: status === "accepted" ? "appointment_accepted" : "appointment_rejected",
    link: `/appointments/${appointment._id}`,
  });

  res.status(200).json(new ApiResponse(200, appointment, `Appointment ${status}`));
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    $or: [{ user: req.user._id }, { mentor: req.user._id }]
  }).populate("mentor user");
  res.status(200).json(new ApiResponse(200, data));
});

// Get my accepted courses (for user)
const getMyCourses = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    user: req.user._id,
    status: 'accepted'
  }).populate('mentor', 'fullName avatar');

  res.status(200).json(new ApiResponse(200, data, "Accepted courses fetched"));
});

// Get my students (for mentor)
const getMyStudents = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    mentor: req.user._id,
    status: 'accepted'
  }).populate('user', 'fullName avatar');

  res.status(200).json(new ApiResponse(200, data, "Accepted students fetched"));
});


export { createAppointment, updateAppointmentStatus, getUserAppointments, getMyCourses, getMyStudents };
