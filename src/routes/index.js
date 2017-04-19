import express from 'express';
const router = express.Router();

import userRoutes from './users';
import sessionRoutes from './session';

router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Mark API Server'
    });
});

router.use('/users', userRoutes);
router.use('/session', sessionRoutes);

export default router;
