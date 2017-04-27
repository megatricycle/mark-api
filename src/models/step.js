import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    instruction: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageTarget: {
        type: Sequelize.STRING,
        allowNull: false
    },
    model: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const options = {
    freezeTableName: true
};

const Step = db.define('steps', attributes, options);

export default Step;
