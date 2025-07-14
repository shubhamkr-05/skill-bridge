import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" })); 
app.use(express.static("public")); 
app.use(cookieParser());

// Importing routers
import appointmentRouter from "./routes/appointment.routes.js";
import sessionRouter from "./routes/session.routes.js"; 
import chatRouter from "./routes/chat.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import ratingRouter from "./routes/rating.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import sessionNoteRouter from "./routes/sessionNote.routes.js";
import userRouter from "./routes/user.routes.js";
import mentorRouter from "./routes/mentor.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";

// Using routers
app.use("/healthcheck", healthcheckRouter);
app.use("/appointments", appointmentRouter);
app.use("/sessions", sessionRouter);
app.use("/chats", chatRouter);
app.use("/payments", paymentRouter);
app.use("/ratings", ratingRouter);
app.use("/notifications", notificationRouter);
app.use("/session-notes", sessionNoteRouter);
app.use("/users", userRouter);
app.use("/mentors", mentorRouter);

// http://localhost:8000/users/login

export { app };