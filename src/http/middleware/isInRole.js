// Current Roles: Admin (admin) (adminRole.js), User (user) (userRole.js)

const isAuthenticated = require("./isAuthenticated")

const adminRole = require("../roles/adminRole")
const userRole = require("../roles/userRole")

const roles = {
    adminRole: adminRole,
    userRole: userRole
}

module.exports = (roleDescription, model) => {
    return (req, res, next) => {
        isAuthenticated(req, res, () => {
            try {
                if (roles[req.user.roleName].can(roleDescription, model)) {
                    next();
                } else {
                    return res.status(403).json({
                        success: false,
                        errorId: "ACCESS_FORBIDDEN",
                        error: "You are not allowed to view this resource!"
                    })
                }
            } catch (e) {
                return res.status(501).json({
                    success: false,
                    errorId: "INTERNAL_SERVER_ERROR",
                    error: "Internal Server Error!"
                })
            }
        })
    }
}