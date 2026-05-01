import express from 'express';
import { protect, authorizeRoles , otpLimiter } from '../middleware/authMiddleware.js';
import { CreateScheme , getScheme, getSchemes } from '../controller/schemecontroller.js';
import { updateSchemeStatus } from '../controller/distributorcontroller.js';

const router = express.Router();



router.post('/create-scheme', protect, authorizeRoles('rep'), CreateScheme);


router.put('/update-status', protect, authorizeRoles('distributor'), updateSchemeStatus);

router.get('/get-scheme', protect, authorizeRoles('rep', 'distributor'), getScheme);

router.get('/get-schemes', protect, getSchemes);


export default router;
