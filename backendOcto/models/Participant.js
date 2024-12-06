const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true }, 
});

module.exports = mongoose.model('Participant', participantSchema);
