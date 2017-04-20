import Sequelize from 'sequelize';

import db from '../db/db';

const attributes = {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    image: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descriptionSummary: {
        type: Sequelize.STRING,
        allowNull: false
    },
    descriptionDetail: {
        type: Sequelize.STRING,
        allowNull: false
    }
};

const options = {
    freezeTableName: true
};

const Product = db.define('products', attributes, options);

export default Product;
