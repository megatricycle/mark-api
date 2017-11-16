import sequelize from 'sequelize';

import {
    Product,
    User,
    Manual,
    Step,
    ObjectModel,
    ImageTarget
} from '../models';
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
                attributes: [
                    'id',
                    'name',
                    'image',
                    'updatedAt',
                    [
                        sequelize.fn('COUNT', sequelize.col('Subscriber.id')),
                        'subscribersCount'
                    ]
                ],
                where: {
                    name: {
                        $like: `${query}%`
                    }
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username']
                    },
                    {
                        model: User,
                        as: 'Subscriber',
                        required: false,
                        attributes: []
                    }
                ],
                group: ['products.id', 'Subscriber.id']
            });

            const queryFromUsers = Product.findAll({
                attributes: [
                    'id',
                    'name',
                    'image',
                    'updatedAt',
                    [
                        sequelize.fn('COUNT', sequelize.col('Subscriber.id')),
                        'subscribersCount'
                    ]
                ],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username'],
                        where: {
                            username: {
                                $like: `${query}%`
                            }
                        }
                    },
                    {
                        model: User,
                        as: 'Subscriber',
                        required: false,
                        attributes: []
                    }
                ],
                group: ['products.id', 'Subscriber.id']
            });

            return Promise.all([queryFromProducts, queryFromUsers]);
        })
        .then(([resultFromProducts, resultFromUsers]) => {
            const products = [...resultFromProducts, ...resultFromUsers];

            return Promise.all([
                User.findById(req.user.id),
                Promise.resolve(products)
            ]);
        })
        .then(([user, products]) => {
            const lookupPromise = products.map(product =>
                user.hasSubscription([product])
            );

            return Promise.all(lookupPromise).then(lookup => {
                products = products.map((product, i) => ({
                    ...product.dataValues,
                    isSubscribed: lookup[i],
                    manuals: []
                }));

                return Promise.resolve(products);
            });
        })
        .then(products => {
            res.send(products);
        })
        .catch(err => next(err));
};

export const getProduct = (req, res, next) => {
    req.checkParams('productId').notEmpty();

    let product;

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
                    'updatedAt',
                    [
                        sequelize.fn('COUNT', sequelize.col('Subscriber.id')),
                        'subscribersCount'
                    ]
                ],
                where: {
                    id: productId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'username', 'updatedAt']
                    },
                    {
                        model: User,
                        as: 'Subscriber',
                        required: false,
                        attributes: []
                    }
                ],
                group: ['products.id', 'Subscriber.id']
            });
        })
        .then(resultProduct => {
            product = resultProduct;

            const getUser = User.findById(req.user.id);

            const getImageTargets = ImageTarget.findAll({
                where: {
                    productId: product.id
                }
            });

            return Promise.all([getUser, getImageTargets]);
        })
        .then(([user, imageTargets]) => {
            product.dataValues = { ...product.dataValues, imageTargets };

            return user.hasSubscription([product]);
        })
        .then(result => {
            product = { ...product.dataValues, isSubscribed: result };

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
                        attributes: ['instruction', 'imageTarget'],
                        include: [ObjectModel]
                    }
                ],
                order: [[Step, 'index']]
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

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId } = req.params;
            const { name, summary } = req.body;

            return Manual.create({
                name,
                summary,
                productId: parseInt(productId)
            });
        })
        .then(manual => {
            const { productId } = req.params;

            return Manual.findOne({
                attributes: ['id', 'name', 'summary', 'updatedAt'],
                where: {
                    id: manual.id,
                    productId
                },
                include: [
                    {
                        model: Step,
                        attributes: ['instruction', 'imageTarget'],
                        include: [ObjectModel]
                    }
                ]
            });
        })
        .then(manual => {
            res.send(manual);
        })
        .catch(err => next(err));
};

export const editManual = (req, res, next) => {
    req.checkParams('productId').notEmpty();
    req.checkParams('manualId').notEmpty();

    req
        .getValidationResult()
        .then(result => {
            if (!result.isEmpty()) {
                return Promise.reject(validationError(result));
            }

            const { productId, manualId } = req.params;

            return Manual.findOne({
                where: {
                    id: manualId,
                    productId
                }
            });
        })
        .then(manual => {
            const { name, summary } = req.body;

            if (name) {
                manual.name = name;
            }

            if (summary) {
                manual.summary = summary;
            }

            if (name || summary) {
                return manual.save();
            } else {
                return Promise.resolve(manual);
            }
        })
        .then(manual => {
            const { steps } = req.body;

            if (steps) {
                return Step.findAll({
                    where: {
                        manualId: manual.id
                    }
                })
                    .then(steps => {
                        const stepsId = steps.map(step => step.id);

                        return ObjectModel.destroy({
                            where: {
                                stepId: {
                                    $in: stepsId
                                }
                            }
                        });
                    })
                    .then(() => {
                        return Step.destroy({
                            where: {
                                manualId: manual.id
                            }
                        });
                    })
                    .then(() => {
                        const promises = steps.map(step =>
                            Step.create(
                                {
                                    ...step,
                                    manualId: manual.id
                                },
                                {
                                    include: [ObjectModel]
                                }
                            )
                        );

                        return Promise.all(promises)
                            .then(() => Promise.resolve(manual))
                            .catch(err => Promise.reject(err));
                    })
                    .catch(err => Promise.reject(err));
            } else {
                return Promise.resolve(manual);
            }
        })
        .then(manual => {
            const { productId } = req.params;

            return Manual.findOne({
                attributes: ['id', 'name', 'summary', 'updatedAt'],
                where: {
                    id: manual.id,
                    productId
                },
                include: [
                    {
                        model: Step,
                        attributes: ['instruction', 'imageTarget'],
                        include: [ObjectModel]
                    }
                ]
            });
        })
        .then(manual => {
            res.send(manual);
        })
        .catch(err => next(err));
};

export const addImageTarget = (req, res, next) => {
    const { filename: imageFilename } = req.file;

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

            return product.createImageTarget({
                url: `/image_targets/${imageFilename}`
            });
        })
        .then(imageTarget => {
            res.send(imageTarget);
        })
        .catch(err => next(err));
};
