import express from 'express';

import uploader from '../util/uploader';

const router = express.Router();
const upload = uploader('images');

import * as userController from '../controllers/users';

router.get('/:userId/products', userController.getProducts);
router.post(
    '/:userId/products',
    upload.single('image'),
    userController.addProduct
);
router.get('/:userId/subscriptions', userController.getSubscriptions);
router.post(
    '/:userId/subscriptions/:productId',
    userController.subscribeToProduct
);
router.delete(
    '/:userId/subscriptions/:productId',
    userController.unsubscribeToProduct
);
router.post('/signup', userController.signup);

export default router;
