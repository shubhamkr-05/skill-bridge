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
    session: { type: Schema.Types.ObjectId, ref: "Session" }, // Reference to the session if scheduled
    requestedAt: { type: Date, default: Date.now },
    fee: { type: Number, required: true }, // store fee amount
  },
  { timestamps: true } 
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);