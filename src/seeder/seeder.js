import fs from 'fs-promise';

import { User, Product, Manual, Step } from '../models';
import { log } from '../util/logger';

let mockData;

// read json file

log('Seed', 'Reading mock data file started.');

fs
    .readFile(__dirname + '/mock_data.json', 'utf-8')
    .then(contents => {
        mockData = JSON.parse(contents);

        log('Seed', 'Reading mock data file done.');

        // users
        const userPromise = User.createUsers(mockData.users);

        // products
        const productPromise = Product.bulkCreate(mockData.products);

        // manuals
        const manualPromise = Manual.bulkCreate(mockData.manuals);

        // steps
        const stepPromise = Step.bulkCreate(mockData.steps);

        log('Seed', 'Inserting into database.');

        return Promise.all([
            userPromise,
            productPromise,
            manualPromise,
            stepPromise
        ]);
    })
    .then(() => {
        return User.findById(3);
    })
    .then(user => {
        return user.addSubscription(1);
    })
    .then(() => {
        log('Seed', 'Inserted into database.');
        log('Seed', 'Seeding successful.');
    })
    .catch(err => {
        log('Error', err);
        log('Seed', 'Seeding failed.');
    });
