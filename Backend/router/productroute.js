import express from 'express'

import {createProduct, getProducts, updateProduct, deleteProduct} from '../controller/productcontroller.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';       


const router = express.Router();

router.post('/create-product', protect, authorizeRoles('distributor', 'admin'), createProduct);
router.get('/get-products', protect, getProducts);
router.put('/update-product/:productId', protect, authorizeRoles('distributor', 'admin'), updateProduct);
router.delete('/delete-product/:productId', protect, authorizeRoles('distributor', 'admin'), deleteProduct);

export default router;