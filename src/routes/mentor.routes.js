import { Router } from "express";
import{
    getMentors,
    getMentorById   
} from "../controllers/user.controller.js";

const router = Router();

router.route("/mentors").get(getMentors);
router.route("/mentors/:mentorId").get(getMentorById);

export default router;