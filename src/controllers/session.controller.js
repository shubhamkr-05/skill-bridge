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
  const sessions = await Session.find({ user: req.user._id }).populate("mentor", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

// Get all sessions for a mentor
const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ mentor: req.user._id }).populate("user", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

const getActiveStudents = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    mentor: req.user._id,
    sessionStatus: "scheduled"
  }).populate("user", "fullName avatar");

  res.status(200).json(new ApiResponse(200, appointments));
});

const markSessionAsCompleted = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await Session.findById(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  if (session.mentor.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }

  session.completed = true;
  await session.save();

  res.status(200).json(new ApiResponse(200, session, "Session marked as completed"));
});

const getUserUpcomingSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({
    user: req.user._id,
    completed: false,
    date: { $gte: new Date() },
  }).populate("mentor", "fullName avatar");

  res.status(200).json(new ApiResponse(200, sessions));
});

export {
  createSession,
  getUserSessions,
  getMentorSessions,
  getActiveStudents,
  markSessionAsCompleted,
  getUserUpcomingSessions,
};
