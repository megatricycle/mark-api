import db from '../db/db';
import * as Models from '../models'; // eslint-disable-line no-unused-vars

export const init = () => {
    // sync ORM to db
    db.sync({
        force: false
    });
};
