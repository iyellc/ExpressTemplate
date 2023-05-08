const express = require("express");
const router = express.Router();
require("dotenv").config();
// Controller Imports:
const AuthController = require("./http/controllers/AuthController");

// Middlewares:

const isInRole = require("./http/middleware/isInRole");

// Auth Routes:
router.post("/auth/login", AuthController.login)
router.post("/auth/register", AuthController.register);
router.post("/auth/refresh", AuthController.refreshToken);

router.get("/protected", isInRole("admin"), (req, res) => {
    res.json({
        success: true,
        message: "\"Hello\" said protected route.",
        user: req.user
    })
})

module.exports = router;