import express from 'express';
import { login, Logout, sendOtp, verifyOtp, getProfile } from '../controller/authcontroller.js';
import { Distributor, Rep } from '../controller/admincontroller.js';    
import { protect, authorizeRoles , otpLimiter } from '../middleware/authMiddleware.js';

   
const router = express.Router();

router.post('/login', login);
router.get('/logout', Logout);
router.post('/send-otp',otpLimiter, sendOtp);
router.post('/verify-otp',otpLimiter, verifyOtp);


router.get('/profile', protect, getProfile);

// Only Admin can access these routes
router.post('/admin/create-distributor', protect, authorizeRoles('admin'), Distributor);
router.post('/admin/create-rep', protect, authorizeRoles('admin'), Rep);

export default router;