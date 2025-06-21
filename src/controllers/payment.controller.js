import { Payment } from "../models/payment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createPaymentRecord = asyncHandler(async (req, res) => {
  const { mentorId, appointmentId, amount, providerPaymentId } = req.body;

  const payment = await Payment.create({
    user: req.user._id,
    mentor: mentorId,
    appointmentId,
    amount,
    providerPaymentId,
    status: "pending",
  });

  res.status(201).json(new ApiResponse(201, payment, "Payment initiated"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  const { status } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment) throw new ApiError(404, "Payment not found");

  payment.status = status;
  await payment.save();
  res.status(200).json(new ApiResponse(200, payment, "Payment status updated"));
});

const getUserPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id });
  res.status(200).json(new ApiResponse(200, payments));
});

export { createPaymentRecord, updatePaymentStatus, getUserPayments };