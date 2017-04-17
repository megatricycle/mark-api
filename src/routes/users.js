import express from 'express';
const router = express.Router();

import * as userController from '../controllers/users';

/* GET users listing. */
router.get('/', userController.getAll);

export default router;
