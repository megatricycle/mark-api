import express from 'express';
const router = express.Router();

import * as productController from '../controllers/products';

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.get('/:productId/manuals/:manualId', productController.getManual);
router.post('/:productId/manuals', productController.addManual);

export default router;
