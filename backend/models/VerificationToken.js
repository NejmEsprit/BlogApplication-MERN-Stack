const mongoose = require('mongoose')
// VerificationToken Schema 
const VerificationTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true,
    }
}, {
    timestamps: true
})
// VerificetionToken Model
const VerificationToken = mongoose.model('VerificationToken', VerificationTokenSchema)
// validate create VerificationToken
module.exports = VerificationToken;
