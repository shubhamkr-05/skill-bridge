import { Session } from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Appointment } from "../models/appointment.model.js";
import { sendNotification } from "../utils/sendNotification.js";

// ✅ Create session
const createSession = asyncHandler(async (req, res) => {
  const { appointmentId, date, time, videoCallLink } = req.body;

  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) throw new ApiError(404, "Appointment not found");

  if (appointment.mentor.toString() !== req.user._id.toString())
    throw new ApiError(403, "Only mentor can create session");

  if (appointment.status !== "accepted")
    throw new ApiError(400, "Appointment not accepted");

  const session = await Session.create({
    mentor: appointment.mentor,
    user: appointment.user,
    appointmentId: appointment._id,
    date,
    time,
    videoCallLink,
  });

  // ✅ Notify User
  await sendNotification({
    userId: appointment.user,
    message: `Your class has been scheduled on ${date} at ${time}`,
    type: "session_scheduled",
    link: `/sessions/${session._id}`,
  });

  return res.status(201).json(new ApiResponse(201, session, "Session created"));
});

// ✅ Get user's sessions
const getUserSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ user: req.user._id }).populate("mentor", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

// ✅ Get mentor's sessions
const getMentorSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({ mentor: req.user._id }).populate("user", "fullName");
  res.status(200).json(new ApiResponse(200, sessions));
});

// ✅ New: Get active students for mentor
const getActiveStudents = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({
    mentor: req.user._id,
    status: { $in: ["accepted", "booked"] }
  }).populate("user", "fullName avatar");

  const students = appointments.map(app => ({
    user: app.user,
    appointmentId: app._id,
    skill: app.skill,
    fee: app.fee,
    status: app.status,
  }));

  res.status(200).json(new ApiResponse(200, students));
});

// ✅ Mark session as completed
const markSessionAsCompleted = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await Session.findById(sessionId);
  if (!session) throw new ApiError(404, "Session not found");

  if (session.mentor.toString() !== req.user._id.toString())
    throw new ApiError(403, "Unauthorized");

  session.completed = true;
  await session.save();

  res.status(200).json(new ApiResponse(200, session, "Session marked as completed"));
});

// ✅ Get user’s upcoming sessions
const getUserUpcomingSessions = asyncHandler(async (req, res) => {
  const sessions = await Session.find({
    user: req.user._id,
    completed: false
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
