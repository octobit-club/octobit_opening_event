const mongoose = require('mongoose');

const challengeProgressSchema = new mongoose.Schema({
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    challengeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
    status: { 
        type: String, 
        enum: ['notcorrected', 'corrected'],  
        default: 'notcorrected' 
    },
    solvedBy : {type: mongoose.Schema.Types.ObjectId,ref:'Participant'}
});

module.exports = mongoose.model('ChallengeProgress', challengeProgressSchema);
