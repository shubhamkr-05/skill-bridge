import mongoose, { Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    skill: { type: String, required: true },
    status: {
      type: String,
      enum: ["booked", "cancelled"],
      default: "booked",
    },
    requestedAt: { type: Date, default: Date.now },
    acceptedAt: { type: Date },
    fee: { type: Number, required: true }, // store fee amount
    paid: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);