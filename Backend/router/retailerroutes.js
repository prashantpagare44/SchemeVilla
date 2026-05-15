import express from 'express';
import { getRetailers, updateRetailer, deleteRetailer } from '../controller/repcontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('admin', 'distributor', 'rep'), getRetailers);
router.put('/update-retailer/:id', protect, authorizeRoles('admin', 'distributor', 'rep'), updateRetailer);
router.delete('/delete-retailer/:id', protect, authorizeRoles('admin', 'distributor', 'rep'), deleteRetailer);

export default router;