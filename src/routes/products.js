import express from 'express';
const router = express.Router();

import * as productController from '../controllers/products';

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.get('/:productId/manuals', productController.getManuals);
router.post('/:productId/manuals', productController.addManual);
router.get('/:productId/manuals/:manualId', productController.getManual);
router.put('/:productId/manuals/:manualId', productController.editManual);

export default router;
