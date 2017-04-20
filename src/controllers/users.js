import * as userTypes from '../constants/userTypes';
import { validationError, resourceNotFound } from '../constants/errorTypes';
import { log } from '../util/logger';
import { User, Product } from '../models';

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

export const getProducts = (req, res, next) => {
    req.checkParams('userId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { userId } = req.params;

            return User.findById(userId);
        })
        .then(user => {
            if (!user) {
                return Promise.reject(resourceNotFound);
            }

            return user.getProducts({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'descriptionSummary',
                    'descriptionDetail',
                    'updatedAt'
                ]
            });
        })
        .then(products => {
            res.send(products);
        })
        .catch(err => next(err));
};

// @TODO: image
export const addProduct = (req, res, next) => {
    req.checkParams('userId').notEmpty();
    req.checkBody('name').notEmpty();
    req.checkBody('descriptionSummary').notEmpty();
    req.checkBody('descriptionDetail').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { userId } = req.params;

            return User.findById(userId);
        })
        .then(user => {
            if (!user) {
                return Promise.reject(resourceNotFound);
            }

            const { name, descriptionSummary, descriptionDetail } = req.body;

            return user.createProduct({
                name,
                image: '/sampleimage.jpg',
                descriptionSummary,
                descriptionDetail
            });
        })
        .then(product => {
            return Product.findOne({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'descriptionSummary',
                    'descriptionDetail'
                ],
                where: {
                    id: product.id
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'updatedAt']
                    }
                ]
            });
        })
        .then(product => {
            res.send(product);
        })
        .catch(err => next(err));
};
