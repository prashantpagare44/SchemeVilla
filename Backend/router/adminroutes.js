import express from 'express';
import { Distributor, Rep } from '../controller/admincontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-distributor', protect, authorizeRoles('admin'), Distributor);
router.post('/create-rep', protect, authorizeRoles('admin'), Rep);

export default router;