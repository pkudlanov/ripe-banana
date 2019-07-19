const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            rating, reviewer, review, film, createdAt, updatedAt
        } = req.body;

        Review
            .create({ 
                rating, reviewer, review, film, createdAt, updatedAt
            })
            .then(review => res.send(review))
            .catch(next);
    });
