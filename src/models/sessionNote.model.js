import mongoose, { Schema } from "mongoose";

const sessionNoteSchema = new Schema(
  {
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, required: true },
    resourceLink: { type: String }, // e.g., Google Docs, PDF, YouTube, etc.
  },
  { timestamps: true }
);

export const SessionNote = mongoose.model("SessionNote", sessionNoteSchema);
