import express from 'express';
const router = express.Router();

import * as userController from '../controllers/users';

router.get('/:userId/products', userController.getProducts);
router.post('/:userId/products', userController.addProduct);
router.post('/signup', userController.signup);

export default router;
