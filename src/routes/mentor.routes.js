import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import{
    getMentors,
    getMentorById,
    addSkillToMentor
} from "../controllers/user.controller.js";

const router = Router();

router.route("/").get(getMentors);
router.route("/:mentorId").get(getMentorById);
router.route("/add-skill").post(verifyJWT, addSkillToMentor);

export default router;