import express from 'express';

import { CreateZone , getZone , Createcompany , getCompany} from '../controller/masterdatacontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/zone', protect, authorizeRoles('admin'), CreateZone);
router.get('/zone', protect, authorizeRoles('admin'), getZone);
router.post('/company', protect, authorizeRoles('admin'), Createcompany);
router.get('/company', getCompany);


export default router;