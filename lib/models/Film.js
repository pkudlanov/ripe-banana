const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    studio: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studio',
        required: true
    },
    released: {
        type: Number,
        required: true
    },
    cast: [
        { role: String, actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Actor',
            required: true
        } }
    ]
});

module.exports = mongoose.model('Film', filmSchema);
