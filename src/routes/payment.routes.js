import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createPaymentRecord,
    getUserPayments,
    updatePaymentStatus,
} from "../controllers/payment.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPaymentRecord);
router.route("/:paymentId").patch(verifyJWT, updatePaymentStatus);
router.route("/").get(verifyJWT, getUserPayments);

export default router;