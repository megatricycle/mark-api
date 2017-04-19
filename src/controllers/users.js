import * as userTypes from '../constants/userTypes';
import { validationError } from '../constants/errorTypes';
import { log } from '../util/logger';
import { User } from '../models';

export const signup = (req, res, next) => {
    req.checkBody('username').notEmpty().isAscii();
    req.checkBody('password').notEmpty().isAscii();
    req
        .checkBody('userType')
        .notEmpty()
        .isIn([userTypes.CONSUMER, userTypes.PROVIDER]);

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return next(validationError(result));
            }

            const { username, password, userType } = req.body;

            return User.createUser({
                username,
                password,
                userType
            });
        })
        .then(user => {
            log(
                'User',
                `User ${user.username} has signed up with type ${user.userType}.`
            );
            res.send({
                message: 'Successfully created user.',
                user
            });
        })
        .catch(err => next(err));
};
