import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["success", "failed", "pending"], required: true },
    paymentProvider: { type: String, default: "razorpay" },
    providerPaymentId: { type: String }, // Razorpay/Stripe txn ID
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
