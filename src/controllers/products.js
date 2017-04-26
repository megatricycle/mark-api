import { Product, User, Manual, Step } from '../models';
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
                attributes: ['id', 'name', 'image', 'updatedAt'],
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
                attributes: ['id', 'name', 'image', 'updatedAt'],
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

export const getProduct = (req, res, next) => {
    req.checkParams('productId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;

            return Product.findOne({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'descriptionSummary',
                    'descriptionDetail',
                    'updatedAt'
                ],
                where: {
                    id: productId
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

export const getManuals = (req, res, next) => {
    req.checkParams('productId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;

            return Product.findById(productId);
        })
        .then(product => {
            if (!product) {
                return Promise.reject(resourceNotFound);
            }

            return product.getManuals({
                attributes: ['id', 'name', 'updatedAt']
            });
        })
        .then(manuals => {
            res.send(manuals);
        })
        .catch(err => next(err));
};

export const getManual = (req, res, next) => {
    req.checkParams('productId').notEmpty();
    req.checkParams('manualId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;
            const { manualId } = req.params;

            return Manual.findOne({
                attributes: ['id', 'name', 'summary', 'updatedAt'],
                where: {
                    id: manualId,
                    productId
                },
                include: [
                    {
                        model: Step,
                        attributes: ['instruction']
                    }
                ]
            });
        })
        .then(manual => {
            res.send(manual);
        })
        .catch(err => next(err));
};

export const addManual = (req, res, next) => {
    req.checkParams('productId').notEmpty();
    req.checkBody('name').notEmpty();
    req.checkBody('summary').notEmpty();
    req.checkBody('steps').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;
            const { name, summary, steps } = req.body;

            return Manual.create(
                {
                    name,
                    summary,
                    steps,
                    productId: parseInt(productId)
                },
                {
                    include: [Step]
                }
            );
        })
        .then(manual => {
            res.send(manual);
        })
        .catch(err => next(err));
};
