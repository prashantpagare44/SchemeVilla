import express from 'express';
import { getRetailers } from '../controller/repcontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'distributor', 'rep'), getRetailers);

export default router;