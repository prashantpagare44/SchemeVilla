import express from 'express';
import { recordPayment ,getPayments} from '../controller/paymentcontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();


router.post('/record', protect, authorizeRoles('rep', 'distributor'), recordPayment);
router.get('/history', protect, authorizeRoles('rep', 'retailer'), getPayments);

export default router;