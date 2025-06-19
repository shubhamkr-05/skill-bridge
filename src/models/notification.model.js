import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    seen: { type: Boolean, default: false },
    type: { type: String, enum: ["info", "success", "warning", "error"], default: "info" },
    link: { type: String }, // e.g. /appointment/123
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
