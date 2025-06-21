import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Appointment } from "../models/appointment.model.js";

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

  res.status(201).json(new ApiResponse(201, appointment, "Appointment created"));
});

const updateAppointmentStatus = asyncHandler(async (req, res) => {
  const { appointmentId } = req.params;
  const { status } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  appointment.status = status;
  if (status === "accepted") appointment.acceptedAt = new Date();

  await appointment.save();
  res.status(200).json(new ApiResponse(200, appointment, "Status updated"));
});

const getUserAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ user: req.user._id }).populate("mentor", "fullName skills");
  res.status(200).json(new ApiResponse(200, appointments));
});

export { createAppointment, updateAppointmentStatus, getUserAppointments };