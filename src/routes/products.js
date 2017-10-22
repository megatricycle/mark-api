import express from 'express';

import uploader from '../util/uploader';

const router = express.Router();
const upload = uploader('image_targets');

import * as productController from '../controllers/products';

router.get('/', productController.getProducts);
router.get('/:productId', productController.getProduct);
router.post(
    '/:productId/image_targets',
    upload.single('image'),
    productController.addImageTarget
);
router.get('/:productId/manuals', productController.getManuals);
router.post('/:productId/manuals', productController.addManual);
router.get('/:productId/manuals/:manualId', productController.getManual);
router.put('/:productId/manuals/:manualId', productController.editManual);

export default router;
