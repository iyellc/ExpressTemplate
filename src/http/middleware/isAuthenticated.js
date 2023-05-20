const jwt = require('jsonwebtoken');
const isTokenExpired = require('../../logic/isTokenExpired');
require('dotenv').config();

const ensureToken = (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        req.token = bearerToken;

        next();
    } else {
        return res.status(400).json({
            success: false,
            errorId: "TOKEN_NOT_FOUND",
            error: "Token header not found! Please mention in Authorization header with format: 'bearer {TOKEN_HERE}'"
        });
    }

}

module.exports = async (req, res, next) => {
    ensureToken(req, res, async () => {
        jwt.verify(req.token, process.env.SECRET_KEY, (err, result) => {
            if (err) {
                if (isTokenExpired(req.token) == true) {
                    res.status(401).json({
                        success: false,
                        errorId: "TOKEN_EXPIRED",
                        error: "Token Expired! Please renew your token in \"/auth/refresh!\""
                    })
                } else {
                    res.status(401).json({
                        success: false,
                        errorId: "UNKNOWN_ERROR_OCCURED",
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