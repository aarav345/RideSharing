const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const blacklistTokenModel = require("../models/blacklistToken.model");
const captainModel = require("../models/captain.model");


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // extracts the token part Authorization: Bearer <token>
    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    // check if the token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if (isBlacklisted) {
        return res.status(401).json({message: "Unauthorized"});
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        req.user = user;
        return next(); // call the next middleware or handler

    } catch (err) {
        return res.status(401).json({message: "Unauthorized"});
    }
}


module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({message: "Unauthorized"});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token: token});
    if (isBlacklisted) {
        return res.status(401).json({message: "Unauthorized"});
    }


    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const captain = await captainModel.findById(decode._id);

        if (!captain) {
            return res.status(401).json({message: "Unauthorized"});
        }
        req.captain = captain;

        return next();
    } catch (err) {
        return res.status(401).json({message: "Unauthorized"});
    }
}
