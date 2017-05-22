import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    type: {
        type: Sequelize.STRING,
        allowNull: false
    },
    x: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    y: {
        type: Sequelize.FLOAT,
        allowNull: false
    },
    z: {
        type: Sequelize.FLOAT,
        allowNull: false
    }
};

const options = {
    freezeTableName: true
};

const ObjectModel = db.define('objects', attributes, options);

export default ObjectModel;
