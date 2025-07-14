import { Session } from "../models/session.model.js";
import { Appointment } from "../models/appointment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendNotification } from "../utils/sendNotification.js";

// Create a new session under an appointment
const createSession = asyncHandler(async (req, res) => {
  const { appointmentId, date, time, videoCallLink } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  if (appointment.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only mentor can create session");
  }

  const session = await Session.create({
    mentor: appointment.mentor,
    user: appointment.user,
    appointmentId,
    date,
    time,
    videoCallLink,
  });

  // Add session to appointment
  appointment.sessions.push(session._id);
  appointment.sessionStatus = "scheduled";
  await appointment.save();

  await sendNotification({
    userId: appointment.user,
    message: `New session scheduled on ${date} at ${time}`,
    type: "session_scheduled",
    link: `/sessions/${session._id}`,
  });

  res.status(201).json(new ApiResponse(201, session, "Session created"));
});

// Get all sessions for a user
const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id })
    .populate("mentor", "fullName avatar")
    .populate("appointmentId", "skill"); // populate appointment to get skill

  // Format skill at top level like mentorSessions
  const formattedSessions = sessions.map((session) => ({
    ...session.toObject(),
    skill: session.appointmentId?.skill || null,
  }));

  res.status(200).json(new ApiResponse(200, formattedSessions));
});

// Get all sessions for a mentor
const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ mentor: req.user._id })
    .populate("user", "fullName avatar")
    .populate("appointmentId", "skill"); // populate appointment to get skill

  // Optionally restructure if you want skill at top level
  const formattedSessions = sessions.map((session) => ({
    ...session.toObject(),
    skill: session.appointmentId?.skill || null,
  }));

  res.status(200).json(new ApiResponse(200, formattedSessions));
});

export {
  createSession,
  getUserSessions,
  getMentorSessions,
};
