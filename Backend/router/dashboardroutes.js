import express from 'express';
import { getDashboardStats } from '../controller/dashboardcontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'distributor'), getDashboardStats);

export default router;
