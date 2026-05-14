import express from 'express';
import { Distributor, Rep ,getDistributor , getReps, updateDistributor, suspendDistributor } from '../controller/admincontroller.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/create-distributor', protect, authorizeRoles('admin'), Distributor);
router.put('/update-distributor/:id', protect, authorizeRoles('admin'), updateDistributor);
router.put('/suspend-distributor/:id', protect, authorizeRoles('admin'), suspendDistributor);
router.post('/create-rep', protect, authorizeRoles('admin','distributor'), Rep);
router.get('/distributors', protect, authorizeRoles('admin'), getDistributor);
router.get('/reps', protect, authorizeRoles('admin'), getReps);  

export default router;