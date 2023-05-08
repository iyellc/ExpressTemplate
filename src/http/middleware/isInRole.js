// Current Roles: Admin (admin) (adminRole.js), User (user) (userRole.js)

const isAuthenticated = require("./isAuthenticated")

const roles = ["admin", "user"] // Index gets smaller as the priority

module.exports = (roleName) => {
    return (req, res, next) => {
        isAuthenticated(req, res, () => { 
            if(roles.includes(roleName)){
                if (roles.findIndex((key) => key == req.user.roleName) <= roles.findIndex((key) => key == roleName )){
                   next()
                }else{
                    return res.status(403).json({
                        success: false,
                        error: "You are not allowed to view this resource!"
                    })
                }
            }else{
                return res.status(501).json({
                    success: false,
                    error: "Internal Server Error!"
                })
            }
        })
    }
}