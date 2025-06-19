import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    fee: { type: Number, required: true }, // store fee amount
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);