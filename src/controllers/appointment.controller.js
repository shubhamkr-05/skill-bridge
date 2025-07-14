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
    message: `${req.user.fullName} booked a course for ${skill}`,
    type: "appointment_booked",
    link: `/appointments/${appointment._id}`,
  });

  res.status(201).json(new ApiResponse(201, appointment, "Appointment booked"));
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const data = await Appointment.find({
    $or: [{ user: req.user._id }, { mentor: req.user._id }],
  })
    .populate("mentor user")
    .populate("sessions");

  res.status(200).json(new ApiResponse(200, data));
});

const getMentorAppointmentStudents = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    mentor: req.user._id,
  })
    .populate("user", "fullName avatar")
    .select("user skill sessionStatus");

  res.status(200).json(new ApiResponse(200, appointments));
});

const getStudentAppointmentMentors = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    user: req.user._id,
  })
    .populate("mentor", "fullName avatar")
    .select("mentor skill sessionStatus");

  res.status(200).json(new ApiResponse(200, appointments));
});


export {
  createAppointment,
  getUserAppointments,
  getMentorAppointmentStudents,
  getStudentAppointmentMentors
};
