import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. '17:30'
    videoCallLink: { type: String }, // Jitsi/Daily.co/WebRTC link
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
