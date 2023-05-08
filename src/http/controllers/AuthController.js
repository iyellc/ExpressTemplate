const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const JOIUserSchema = require('../validation/JOIUserSchema')

const User = require("../../db/models/User");
const RefreshToken = require('../../db/models/RefreshToken');

module.exports.login = asyncHandler(async (req, res) => {
    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        return res.status(400).json({
            success: false,
            message: "Fields Not Provided"
        })
    } else {
        if (typeof JOIUserSchema.validate({ username: req.body.username, password: req.body.password }).error !== "undefined") {
            return res.json(JOIUserSchema.validate({ username: req.body.username, password: req.body.password }));
        }

        let userData = {
            username: req.body.username,
            password: req.body.password,
        }
        let user = await User.findOne({
            username: userData.username,
            password: userData.password
        });

        if (user != null) {
            user.client_id = user._id;
            user.password = undefined;

            let token = jwt.sign(user.toJSON(), process.env.SECRET_KEY, { expiresIn: "360000" });
            let refreshToken = await RefreshToken.findOne({ belongsTo: user._id });

            refreshToken.currentToken = token;
            await refreshToken.save();

            return res.json({
                success: true,
                data: {
                    REFRESH_TOKEN: refreshToken.refreshToken,
                    ACCESS_TOKEN: token,
                    EXPIRES_IN: 3600,
                    TYPE: "Bearer"
                }
            })
        } else {
            return res.json({
                success: false,
                error: "Invalid credentials",
            });
        }
    }
})

module.exports.register = asyncHandler(async (req, res) => {
    if (typeof req.body.username === "undefined" || typeof req.body.password === "undefined") {
        return res.status(400).json({
            success: false,
            error: "Fields Not Provided"
        })
    } else {
        if (typeof JOIUserSchema.validate({ username: req.body.username, password: req.body.password }).error !== "undefined") {
            return res.json(JOIUserSchema.validate({ username: req.body.username, password: req.body.password }));
        }

        let userData = {
            username: req.body.username,
            password: req.body.password,
            clientSecret: req.body.password + req.body.username, // TODO: Add RSG
            roleName: "user"
        }

        if (await User.exists({ username: userData.username }) != null) {
            return res.status(400).json({
                success: false,
                error: "Username already exists!",
            });
        }
        try {
            let user = await new User(userData).save()

            userData.client_id = user._id;
            userData.password = undefined;

            let token = jwt.sign(userData, process.env.SECRET_KEY, { expiresIn: "360000" });

            let refreshToken = await new RefreshToken({
                refreshToken: req.body.username + req.body.password, // TODO: Add RSG,
                belongsTo: user._id,
                currentToken: token
            }).save()
            return res.status(200).json({
                success: true,
                data: {
                    REFRESH_TOKEN: refreshToken.refreshToken,
                    ACCESS_TOKEN: token,
                    EXPIRES_IN: 3600,
                    TYPE: "Bearer"
                }
            })

        } catch (err) {
            return res.status(500).json({
                success: false,
                error: "Internal Server Error, Please contact the application owner. "
            })
        }
    }
})

module.exports.refreshToken = asyncHandler(async (req, res) => {
    if (typeof req.body.refreshToken === "undefined" || typeof req.body.username === "undefined") {
        return res.status(400).json({
            success: false,
            message: "Fields Not Provided"
        })
    } else {
        let refreshTokenRecord = await RefreshToken.findOne({ refreshToken: req.body.refreshToken });

        if (refreshTokenRecord != null) {
            let userRecord = await User.findById(refreshTokenRecord.belongsTo);
            if (typeof userRecord !== "undefined") {
                // Successful!
                userRecord.password = undefined;
                let token = jwt.sign(userRecord.toJSON(), process.env.SECRET_KEY, { expiresIn: "360000" });

                refreshTokenRecord.currentToken = token;
                await refreshTokenRecord.save();

                return res.json({
                    success: true,
                    data: {
                        REFRESH_TOKEN: refreshTokenRecord.refreshToken,
                        ACCESS_TOKEN: token,
                        EXPIRES_IN: 3600,
                        TYPE: "Bearer"
                    }
                })
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Token Not Found!"
            })
        }
    }
})