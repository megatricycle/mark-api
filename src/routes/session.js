import express from 'express';
const router = express.Router();

import * as sessionController from '../controllers/session';

router.post('/login', sessionController.login);
router.post('/logout', sessionController.logout);
router.get('/whoami', sessionController.whoami);

export default router;
