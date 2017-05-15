import passport from 'passport';

import {
    validationError,
    invalidCredentials,
    forbidden
} from '../constants/errorTypes';
import { log } from '../util/logger';

export const login = (req, res, next) => {
    req.checkBody('username').notEmpty().isAscii();
    req.checkBody('password').notEmpty().isAscii();
    req.checkBody('userType').notEmpty().isAscii();

    req.getValidationResult().then(result => {
        if (!result.isEmpty()) {
            return next(validationError(result));
        }

        passport.authenticate('local', (err, user, info) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(invalidCredentials(info.message));
            }

            req.logIn(user, err => {
                if (err) {
                    return next(err);
                }

                res.send({
                    message: 'Successfully logged in.',
                    id: req.user.id,
                    username: req.user.username,
                    userType: req.user.userType
                });

                log('User', `User "${req.user.username}" logged in.`);
            });
        })(req, res, next);
    });
};

export const logout = (req, res, next) => {
    if (!req.user) {
        return next(forbidden);
    }

    const { username } = req.user;

    req.logout();

    res.send({
        message: 'Successfully logged out.'
    });

    log('User', `User "${username}" logged out.`);
};

export const whoami = (req, res) => {
    if (!req.user) {
        return res.send({});
    }

    res.send(req.user);
};
