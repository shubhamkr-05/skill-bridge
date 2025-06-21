import { Chat } from "../models/chat.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendMessage = asyncHandler(async (req, res) => {
  const { sessionId, content } = req.body;

  let chat = await Chat.findOne({ sessionId });

  if (!chat) {
    chat = await Chat.create({
      sessionId,
      participants: [req.user._id],
      messages: [],
    });
  }

  chat.messages.push({ sender: req.user._id, content, timestamp: new Date() });
  await chat.save();

  res.status(201).json(new ApiResponse(201, chat, "Message sent"));
});

const getSessionChat = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const chat = await Chat.findOne({ sessionId }).populate("messages.sender", "fullName");
  res.status(200).json(new ApiResponse(200, chat));
});

export { sendMessage, getSessionChat };
