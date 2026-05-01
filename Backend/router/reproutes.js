import express from 'express';
import { sendRetailerOtp, verifyAndCreateRetailer } from '../controller/repcontroller.js';
import { protect, authorizeRoles, otpLimiter } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send-retailer-otp', protect, authorizeRoles('rep'), otpLimiter, sendRetailerOtp);
router.post('/verify-retailer', protect, authorizeRoles('rep'), otpLimiter, verifyAndCreateRetailer);

export default router;