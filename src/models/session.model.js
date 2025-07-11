import mongoose, { Schema } from "mongoose";

const sessionSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true }, // e.g. '17:30'
    videoCallLink: { type: String },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    completed: { type: Boolean, default: false },
    notes: { type: String } // optional: mentor notes
  },
  { timestamps: true }
);

export const Session = mongoose.model("Session", sessionSchema);
