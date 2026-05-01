import express from 'express';
import { login, Logout, sendOtp, verifyOtp, getProfile } from '../controller/authcontroller.js';
import { protect, otpLimiter } from '../middleware/authMiddleware.js';

   
const router = express.Router();

router.post('/login', login);
router.post('/send-otp',otpLimiter, sendOtp);
router.post('/verify-otp',otpLimiter, verifyOtp);
router.get('/profile', protect, getProfile);
router.get('/logout', Logout);

export default router;