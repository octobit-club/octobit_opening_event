const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    correctFlag: { type: String, required: true },
});

module.exports = mongoose.model('Challenge', challengeSchema);
