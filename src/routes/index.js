import express from 'express';
const router = express.Router();

import userRoutes from './users';

router.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Mark API Server'
    });
});

router.use('/users', userRoutes);

export default router;
