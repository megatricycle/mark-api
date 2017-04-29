import express from 'express';
const router = express.Router();

import userRoutes from './users';
import sessionRoutes from './session';
import productRoutes from './products';
import { forbidden } from '../constants/errorTypes';

router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Mark API Server'
    });
});

router.use('/session', sessionRoutes);

// all routes beyond this must have a user logged in
router.use((req, res, next) => {
    if (!req.user) {
        next(forbidden);
    } else {
        next();
    }
});

router.use('/users', userRoutes);
router.use('/products', productRoutes);

export default router;
