import { Session } from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { sendNotification } from "../utils/sendNotification.js";


const createSession = asyncHandler(async (req, res) => {
  const { appointmentId, date, time, videoCallLink } = req.body;

  const appointment = await Appointment.findById(appointmentId);

  if (!appointment) {
    throw new ApiError(404, "Appointment not found");
  }

  // Check if the logged-in user is the mentor of the appointment
  if (appointment.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the mentor can create sessions");
  }

  // Check if appointment was accepted
  if (appointment.status !== "accepted") {
    throw new ApiError(400, "Appointment is not accepted yet");
  }

  const session = await Session.create({
    mentor: appointment.mentor,
    user: appointment.user,
    appointmentId: appointment._id,
    date,
    time,
    videoCallLink,
  });

  // Send notification to user
  await sendNotification({
    userId: appointment.user,
    message: `New session scheduled by your mentor for ${date} at ${time}`,
    type: "session_scheduled",
    link: `/sessions/${session._id}`,
  });

  return res.status(201).json(new ApiResponse(201, session, "Session created"));
});

const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).populate("mentor", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ mentor: req.user._id }).populate("user", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

export { createSession, getUserSessions, getMentorSessions };
