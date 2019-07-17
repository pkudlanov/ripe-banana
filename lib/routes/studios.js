const { Router } = require('express');
const Studio = require('../models/Studio');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            name,
            address,
            city,
            state,
            country
        } = req.body;

        Studio
            .create({ name, address, city, state, country })
            .then(studio => res.send(studio))
            .catch(next);
    })
    .get('/', (req, res, next) => {
        Studio
            .find()
            .select({ _id: true, name: true })
            .then(studios => res.send(studios))
            .catch(next);
    });
