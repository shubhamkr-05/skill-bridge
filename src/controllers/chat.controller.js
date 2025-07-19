import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { Appointment } from "../models/appointment.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

export const getUserChats = async (req, res) => {
  const chats = await Chat.find({ members: req.user._id }).populate("members", "fullName avatar");
  res.json({ success: true, data: chats });
};

export const getMessages = async (req, res) => {
  const chatId = req.params.chatId;
  const userId = req.user._id;

  // 1. Mark all messages not yet seen by this user
  await Message.updateMany(
    { chat: chatId, seenBy: { $ne: userId } },
    { $addToSet: { seenBy: userId } }
  );

  // 2. Fetch updated messages
  const messages = await Message.find({ chat: chatId }).populate("sender", "fullName");

  res.json({ success: true, data: messages });
};

export const createMessage = async (req, res) => {
  const { chatId, message } = req.body;

  let fileUrl = null;
  let filePublicId = null;

  // If file is attached
  const fileLocalPath = req.files?.file?.[0]?.path;

  if (fileLocalPath) {
    const uploadResult = await uploadOnCloudinary(fileLocalPath);

    if (!uploadResult) {
      return res.status(400).json({ success: false, message: "File upload failed" });
    }

    fileUrl = uploadResult.url;
    filePublicId = uploadResult.public_id;
  }

  // Create and save the message
  const newMsg = await Message.create({
    chat: chatId,
    sender: req.user._id,
    message,
    fileUrl,
    filePublicId,
    seenBy: [req.user._id],
  });

  return res.status(201).json({ success: true, data: newMsg });
};

export const createChat = async (req, res) => {
  const { recipientId } = req.body;

  const existingChat = await Chat.findOne({
    members: { $all: [req.user._id, recipientId] },
  });

  if (existingChat) {
    return res.status(200).json({ success: true, data: existingChat });
  }

  const newChat = await Chat.create({
    members: [req.user._id, recipientId],
  });

  res.status(201).json({ success: true, data: newChat });
};

export const getContacts = async (req, res) => {
  const appointments = await Appointment.find({
    $or: [
      { user: req.user._id },
      { mentor: req.user._id },
    ],
  }).populate("user mentor", "fullName avatar");

  const contacts = new Set();
  appointments.forEach((a) => {
    if (String(a.user._id) !== req.user._id.toString()) contacts.add(JSON.stringify(a.user));
    if (String(a.mentor._id) !== req.user._id.toString()) contacts.add(JSON.stringify(a.mentor));
  });

  const parsedContacts = Array.from(contacts).map((c) => JSON.parse(c));
  res.json({ success: true, data: parsedContacts });
};
