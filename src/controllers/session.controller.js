import { Session } from "../models/session.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createSession = asyncHandler(async (req, res) => {
  const { mentorId, userId, appointmentId, date, time, videoCallLink } = req.body;

  const session = await Session.create({
    mentor: mentorId,
    user: userId,
    appointmentId,
    date,
    time,
    videoCallLink,
  });

  res.status(201).json(new ApiResponse(201, session, "Session created"));
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
