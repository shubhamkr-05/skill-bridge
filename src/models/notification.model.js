import mongoose, { Schema } from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  message: { type: String, required: true },
  type: { type: String, enum: ["appointment_request", "appointment_accepted", "appointment_rejected", "session_scheduled"], required: true },
  link: { type: String }, // optional: could point to appointment/session ID
  seen: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);