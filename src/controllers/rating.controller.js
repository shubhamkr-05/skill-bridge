import { Rating } from "../models/rating.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const submitRating = asyncHandler(async (req, res) => {
  const { mentorId, sessionId, rating, review } = req.body;

  const newRating = await Rating.create({
    mentor: mentorId,
    user: req.user._id,
    sessionId,
    rating,
    review,
  });

  res.status(201).json(new ApiResponse(201, newRating, "Rating submitted"));
});

const getMentorRatings = asyncHandler(async (req, res) => {
  const { mentorId } = req.params;

  const ratings = await Rating.find({ mentor: mentorId }).populate("user", "fullName");

  const totalRatings = ratings.length;
  const avgRating = totalRatings === 0
    ? 0
    : ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

  res.status(200).json(new ApiResponse(200, {
    ratings,
    totalRatings,
    averageRating: avgRating.toFixed(1), // rounded to 1 decimal, e.g., 4.3
  }));
});

export { submitRating, getMentorRatings };