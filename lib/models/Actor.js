const mongoose = require('mongoose');

const actorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: Date,
    pob: String
});

module.exports = mongoose.model('Actor', actorSchema);
