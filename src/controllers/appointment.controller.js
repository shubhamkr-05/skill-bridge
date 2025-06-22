import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";
import { Notification } from "../models/notification.model.js";
import { sendNotification } from "../utils/sendNotification.js";

const createAppointment = asyncHandler(async (req, res) => {
  const { mentorId, skill, fee } = req.body;

  if (!mentorId || !skill || !fee) {
    throw new ApiError(400, "All fields are required");
  }

  const appointment = await Appointment.create({
    mentor: mentorId,
    user: req.user._id,
    skill,
    fee,
  });

  // Push notification to mentor
  await sendNotification({
    userId: mentorId,
    message: `New appointment request from ${req.user.fullName} for skill: ${skill}`,
    type: "appointment_request",
    link: `/appointments/${appointment._id}`,
  });

  res.status(201).json(new ApiResponse(201, appointment, "Appointment created"));
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(appointmentId).populate("user mentor");
  if (!appointment) throw new ApiError(404, "Appointment not found");

  appointment.status = status;
  if (status === "accepted") appointment.acceptedAt = new Date();
  await appointment.save();

  // Notify user about mentor's decision
  const type = status === "accepted" ? "appointment_accepted" : "appointment_rejected";
  const message =
    status === "accepted"
      ? `Your appointment with ${appointment.mentor.fullName} has been accepted.`
      : `Your appointment with ${appointment.mentor.fullName} has been rejected.`;

  await sendNotification({
    userId: appointment.user._id,
    message,
    type,
    link: `/appointments/${appointment._id}`,
  });
  
  res.status(200).json(new ApiResponse(200, appointment, "Appointment status updated"));
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id }).populate("mentor", "fullName skills");
  res.status(200).json(new ApiResponse(200, appointments));
});

export { createAppointment, updateAppointmentStatus, getUserAppointments };