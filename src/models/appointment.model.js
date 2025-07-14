import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    sessionStatus: {
      type: String,
      enum: ["scheduled", "notScheduled"],
      default: "notScheduled",
    },
    sessions: [{ type: Schema.Types.ObjectId, ref: "Session" }],
    requestedAt: { type: Date, default: Date.now },
    fee: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);
