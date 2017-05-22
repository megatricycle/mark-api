import fs from 'fs-promise';

import { User, Product, Manual, Step, ObjectModel } from '../models';
import { log } from '../util/logger';

let mockData;

// read json file

log('Seed', 'Reading mock data file started.');

fs
    .readFile(__dirname + '/mock_data.json', 'utf-8')
    .then(contents => {
        mockData = JSON.parse(contents);

        log('Seed', 'Reading mock data file done.');

        log('Seed', 'Inserting into database.');

        return User.createUsers(mockData.users);
    })
    .then(() => {
        return Product.bulkCreate(mockData.products);
    })
    .then(() => {
        return Manual.bulkCreate(mockData.manuals);
    })
    .then(() => {
        return Step.bulkCreate(mockData.steps);
    })
    .then(() => {
        return ObjectModel.bulkCreate(mockData.objectModels);
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
