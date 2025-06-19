import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema(
  {
    mentor: { type: Schema.Types.ObjectId, ref: "User", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sessionId: { type: Schema.Types.ObjectId, ref: "Session", required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    review: { type: String, maxlength: 1000 },
  },
  { timestamps: true }
);

export const Rating = mongoose.model("Rating", ratingSchema);
