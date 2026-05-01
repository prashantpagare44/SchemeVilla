import express from 'express';
import { CreateOrder, receiveOrder, getOrders, updateOrderStatus } from '../controller/ordercontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order',protect, authorizeRoles('rep'),CreateOrder);
router.get('/receive-order',protect, authorizeRoles('rep'),receiveOrder);
router.get('/', protect, getOrders);
router.put('/update-status', protect, authorizeRoles('distributor', 'admin'), updateOrderStatus);


export default router;