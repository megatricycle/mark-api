import express from 'express';
const router = express.Router();

import * as productController from '../controllers/products';

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);

export default router;
