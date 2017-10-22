import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const storage = folder => {
    return multer.diskStorage({
        destination: `src/public/${folder}`,
        filename(req, file, cb) {
            crypto.pseudoRandomBytes(16, (err, raw) => {
                if (err) {
                    return cb(err);
                }

                cb(null, raw.toString('hex') + path.extname(file.originalname));
            });
        }
    });
};

export default folder => {
    return multer({ storage: storage(folder) });
};
