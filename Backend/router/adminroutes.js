import express from 'express';
import { Distributor, Rep ,getDistributor , getRep } from '../controller/admincontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/create-distributor', protect, authorizeRoles('admin'), Distributor);
router.post('/create-rep', protect, authorizeRoles('admin'), Rep);
router.get('/distributors', protect, authorizeRoles('admin'), getDistributor);
router.get('/reps', protect, authorizeRoles('admin'), getRep);  

export default router;