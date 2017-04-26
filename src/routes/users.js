import express from 'express';
const router = express.Router();

import * as userController from '../controllers/users';

router.get('/:userId/products', userController.getProducts);
router.post('/:userId/products', userController.addProduct);
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
