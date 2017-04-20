import Sequelize from 'sequelize';

import * as userTypes from '../constants/userTypes';
import { hashPassword } from '../util/security';
import db from '../db/db';

const attributes = {
    username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
            is: /^[a-z0-9\_\-]+$/i
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    salt: {
        type: Sequelize.STRING,
        allowNull: false
    },
    userType: {
        type: Sequelize.ENUM(userTypes.PROVIDER, userTypes.CONSUMER)
    }
};

const options = {
    freezeTableName: true,
    classMethods: {
        createUser({ username, password, userType }) {
            const hashedPassword = hashPassword(password);

            return this.create({
                username,
                userType,
                password: hashedPassword.hash,
                salt: hashedPassword.salt
            });
        },
        createUsers(users) {
            users = users.map(user => {
                const hashedPassword = hashPassword(user.password);

                return {
                    username: user.username,
                    userType: user.userType,
                    password: hashedPassword.hash,
                    salt: hashedPassword.salt
                };
            });

            return this.bulkCreate(users);
        }
    },
    instanceMethods: {
        toJSON() {
            let values = Object.assign({}, this.get());

            delete values.password;
            delete values.salt;

            return values;
        }
    }
};

const User = db.define('users', attributes, options);

export default User;
