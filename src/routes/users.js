import express from 'express';
const router = express.Router();

import * as userController from '../controllers/users';

router.post('/signup', userController.signup);

export default router;
