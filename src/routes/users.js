import express from 'express';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const router = express.Router();
const storage = multer.diskStorage({
    destination: 'src/public/images',
    filename(req, file, cb) {
        crypto.pseudoRandomBytes(16, (err, raw) => {
            if (err) {
                return cb(err);
            }

            cb(null, raw.toString('hex') + path.extname(file.originalname));
        });
    }
});
const upload = multer({ storage });

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
