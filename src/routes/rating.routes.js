import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  submitRating,
  getMentorRatings,
} from "../controllers/rating.controller.js";

const router = Router();

router.route("/ratings").post(verifyJWT, submitRating);
router.route("/ratings/:mentorId").get(verifyJWT, getMentorRatings);

export default router;