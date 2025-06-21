import { SessionNote } from "../models/sessionNote.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addSessionNote = asyncHandler(async (req, res) => {
  const { sessionId, userId, note, resourceLink } = req.body;

  const sessionNote = await SessionNote.create({
    sessionId,
    mentor: req.user._id,
    user: userId,
    note,
    resourceLink,
  });

  res.status(201).json(new ApiResponse(201, sessionNote, "Note added"));
});

const getSessionNotes = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const notes = await SessionNote.find({ sessionId });
  res.status(200).json(new ApiResponse(200, notes));
});

export { addSessionNote, getSessionNotes };