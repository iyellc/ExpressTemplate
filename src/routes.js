const express = require("express");
const router = express.Router();
require("dotenv").config();
// Controller Imports:
const AuthController = require("./http/controllers/AuthController");

// Middlewares:

const hasPermission = require("./http/middleware/hasPermission");
const validateBody = require("./http/middleware/validateBody");

// Auth Routes:
router.post("/auth/login", validateBody("userSchema"), AuthController.login)
router.post("/auth/register", validateBody("userSchema"), AuthController.register);
router.post("/auth/refresh", AuthController.refreshToken);

router.get("/protected", hasPermission("read", "User"), (req, res) => {
    res.json({
        success: true,
        message: "\"Hello\" said protected route.",
        user: req.user
    })
})

module.exports = router;