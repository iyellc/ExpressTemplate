const mongoose = require("mongoose");

const RefreshTokenSchema = mongoose.Schema({
    refreshToken: { type: String, unique: true, required: true },
    belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    currentToken: { type: String, unique: true, required: true }
}, { timestamps: true })

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);