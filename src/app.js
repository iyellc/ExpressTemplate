const express = require("express");
const path = require('path');
const routes = require("./routes");
const exphbs = require('express-handlebars');
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3300;

const db = require("./db/db");
const User = require("./db/models/User");
const RefreshToken = require('./db/models/RefreshToken');
const adminRole = require('./http/roles/adminRole');
const { mongoose } = require("mongoose");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));

app.set('view engine', '.hbs');
app.use("", routes)

app.use("*", function (req, res, next) {
    next(res.status(404).json({
        success: false,
        errorId: "PAGE_NOT_FOUND",
        error: "Material is not found!"
    }));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500).json({
        success: false,
        errorId: "UNKNOWN_ERROR_OCCURED",
        error: (app.get("env") == "development") ? "An unknown error has occured: " + err.message : "An unknown error has occured!"
    })
});

app.listen(PORT, async () => {
    console.log("App is online at port: " + PORT)
    const _db = db;
    mongoose.plugin(accessibleRecordsPlugin);
    mongoose.plugin(accessibleFieldsPlugin);
})