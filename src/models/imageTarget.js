import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    url: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const options = {
    freezeTableName: true,
    tableName: 'image_targets'
};

const ImageTarget = db.define('imageTargets', attributes, options);

export default ImageTarget;
