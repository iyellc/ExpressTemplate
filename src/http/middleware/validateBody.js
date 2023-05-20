const validators = require("../validation/validators")

module.exports = (validatorName) => {
    return (req, res, next) => {
        if (!validators.hasOwnProperty(validatorName)) {
            return res.status(500).json({
                success: false,
                errorId: "INTERNAL_SERVER_ERROR",
                error: "Please contact the application owner!"
            })
        }
        let joiValidation;

            joiValidation = validators[validatorName].validate(req.body);

            if (typeof joiValidation.error !== "undefined") {
                return res.status(400).json({
                    success: false,
                    errorId: "INVALID_REQUEST",
                    error: "JOI validation is not passed, invalid request!",
                    validation: joiValidation
                })
            } else {
                next()
            }
    }
}