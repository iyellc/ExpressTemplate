module.exports = (req, res, next) => {
    let bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(" ");
        let bearerToken = bearer[1];
        req.token = bearerToken;
        
        next();
    } else {
        return res.status(400).json({
            success: false,
            error: "Token header not found! Please mention in Authorization header with format: 'bearer {TOKEN_HERE}'"
        });
    }
}