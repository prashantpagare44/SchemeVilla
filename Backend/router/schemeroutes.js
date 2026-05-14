import express from 'express';
import { protect, authorizeRoles , otpLimiter } from '../middleware/authMiddleware.js';
import { CreateScheme , getScheme, getSchemes, updateScheme, deleteScheme, updateSchemeStatus } from '../controller/schemecontroller.js';

const router = express.Router();



router.post('/create-scheme', protect, authorizeRoles('rep','distributor'), CreateScheme);

router.put('/update-status/:id', protect, authorizeRoles('distributor'), updateSchemeStatus);
router.put('/update-scheme/:id', protect, authorizeRoles('distributor'), updateScheme);
router.delete('/delete-scheme/:id', protect, authorizeRoles('distributor'), deleteScheme);

router.get('/get-scheme', protect, authorizeRoles('rep', 'distributor'), getScheme);

router.get('/get-schemes', protect, getSchemes);


export default router;
