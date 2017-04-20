import express from 'express';
const router = express.Router();

import userRoutes from './users';
import sessionRoutes from './session';
import productRoutes from './products';

router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Mark API Server'
    });
});

router.use('/users', userRoutes);
router.use('/session', sessionRoutes);
router.use('/products', productRoutes);

export default router;
