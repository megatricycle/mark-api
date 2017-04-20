import { Product, User } from '../models';
import { validationError, resourceNotFound } from '../constants/errorTypes';

export const getProducts = (req, res, next) => {
    req.checkQuery('query').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { query } = req.query;

            const queryFromProducts = Product.findAll({
                attributes: ['id', 'name', 'image'],
                where: {
                    name: {
                        $like: `%${query}%`
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ]
            });

            const queryFromUsers = Product.findAll({
                attributes: ['id', 'name', 'image'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        where: {
                            username: {
                                $like: `%${query}%`
                            }
                        }
                    }
                ]
            });

            return Promise.all([queryFromProducts, queryFromUsers]);
        })
        .then(([resultFromProducts, resultFromUsers]) => {
            const products = [...resultFromProducts, ...resultFromUsers];

            res.send(products);
        })
        .catch(err => next(err));
};

// @TODO: manuals
export const getProduct = (req, res, next) => {
    req.checkParams('productId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;

            return Product.findAll({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'descriptionSummary',
                    'descriptionDetail'
                ],
                where: {
                    id: productId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username']
                    }
                ],
                limit: 1
            });
        })
        .then(product => {
            if (!product) {
                return Promise.reject(resourceNotFound);
            }

            res.send(product[0]);
        })
        .catch(err => next(err));
};
