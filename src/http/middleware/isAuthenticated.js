const jwt = require('jsonwebtoken');
const ensureToken = require('./ensureToken');
const isTokenExpired = require('../../logic/isTokenExpired');
require('dotenv').config();

module.exports = async (req, res, next) => {
    ensureToken(req, res, async () => {
        jwt.verify(req.token, process.env.SECRET_KEY, (err, result) => {
            if (err) {
                if (isTokenExpired(req.token) == true) {
                    res.status(401).json({
                        success: false,
                        error: "Token Expired! Please renew your token in \"/auth/refresh!\""
                    })
                } else {
                    res.status(401).json({
                        success: false,
                        error: "Unknown error has occured!"
                    })
                }
            } else {
                req.user = result;
                next();
            }
        })
    })
}