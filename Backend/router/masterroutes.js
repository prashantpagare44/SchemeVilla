import express from 'express';

import { CreateZone , getZone , Createcompany , getCompany , UpdateZone , DeleteZone , UpdateCompany , DeleteCompany } from '../controller/masterdatacontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/zone', protect, authorizeRoles('admin'), CreateZone);
router.get('/zone', protect, authorizeRoles('admin','distributor','rep'), getZone);
router.post('/company', protect, authorizeRoles('admin'), Createcompany);
router.get('/company', getCompany);
router.put('/zone/:id', protect, authorizeRoles('admin'), UpdateZone);
router.delete('/zone/:id', protect, authorizeRoles('admin'), DeleteZone);
router.put('/company/:id', protect, authorizeRoles('admin'), UpdateCompany);    
router.delete('/company/:id', protect, authorizeRoles('admin'), DeleteCompany);


export default router;