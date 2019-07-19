const { Router } = require('express');
const Film = require('../models/Film');

module.exports = Router()
    .post('/', (req, res, next) => {
        const {
            title, studio, released, cast, role, actor
        } = req.body;

        Film
            .create({ title, studio, released, cast, role, actor })
            .then(film => res.send(film))
            .catch(next);
    });
