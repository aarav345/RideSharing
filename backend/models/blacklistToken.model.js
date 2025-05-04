const mongoose = require("mongoose");

const blackListTokenSchema = mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24, // 1 day
    }
})


module.exports = mongoose.model("BlackListToken", blackListTokenSchema);