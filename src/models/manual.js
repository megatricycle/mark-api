import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    summary: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const options = {
    freezeTableName: true
};

const Manual = db.define('manuals', attributes, options);

export default Manual;
