import db from '../db/db';
import * as Models from '../models'; // eslint-disable-line no-unused-vars
import { log } from '../util/logger';

log('DB', 'Database schema reset started.');

// sync ORM to db
db
    .sync({
        force: true
    })
    .then(() => {
        log('DB', 'Database schema reset success.');

        db.close();

        return null;
    })
    .catch(err => {
        log('Error', err);

        log('DB', 'Database schema reset failed.');

        db.close();

        return null;
    });
