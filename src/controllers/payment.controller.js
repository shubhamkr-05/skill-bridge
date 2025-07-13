import { Payment } from "../models/payment.model.js";
import { Appointment } from "../models/appointment.model.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendNotification } from "../utils/sendNotification.js";

const createRazorpayOrder = asyncHandler(async (req, res) => {  
  const { amount, mentorId, skill } = req.body;

  if (!amount || !mentorId || !skill) {
    throw new ApiError(400, "Missing required fields");
  }

  const options = {
    amount: amount * 100, // in paise
    currency: "INR",
    receipt: `receipt_${Math.floor(Math.random() * 1000000)}`,
  };

  const order = await razorpay.orders.create(options);

  if (!order) throw new ApiError(500, "Failed to create Razorpay order");

  res.status(200).json(
    new ApiResponse(200, {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID,
      mentorId,
      skill,
    }, "Razorpay order created")
  );
});

const verifyAndCreateAppointment = asyncHandler(async (req, res) => {  
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    mentorId,
    skill,
    fee
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !mentorId ||
    !skill ||
    !fee
  ) {
    throw new ApiError(400, "Missing required fields");
  }

  // Step 1: Verify Signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid payment signature");
  }

  // Step 2: Create Appointment
  const appointment = await Appointment.create({
    user: req.user._id,
    mentor: mentorId,
    skill,
    fee,
    sessionStatus: "notScheduled",
    requestedAt: new Date(),
  });  

  // Step 3: Store Payment Record
  const payment = await Payment.create({
    user: req.user._id,
    mentor: mentorId,
    appointmentId: appointment._id,
    amount: fee,
    providerPaymentId: razorpay_payment_id,
    status: "success",
  });

  await sendNotification({
    userId: mentorId,
    message: `${req.user.fullName} booked your course: ${skill}`,
    type: "appointment_request",
    link: `/appointments/${appointment._id}`,
  });

  res.status(201).json(new ApiResponse(201, {
    appointment,
    payment
  }, "Payment verified & appointment created"));
});

export {
  createRazorpayOrder,
  verifyAndCreateAppointment,
};
