import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    index: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    instruction: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageTarget: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const options = {
    freezeTableName: true
};

const Step = db.define('steps', attributes, options);

export default Step;
