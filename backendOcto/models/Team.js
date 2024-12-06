const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    maxMembers: { type: Number, default: 5 },
    currentMembers: { type: Number, default: 0 },
    participants: [ 
        { type: mongoose.Schema.Types.ObjectId, ref: 'Participant' }
    ],
    challenges: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' }
    ],
    completedChallenges: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge' } 
    ],
});

module.exports = mongoose.model('Team', teamSchema );
