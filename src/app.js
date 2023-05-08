const express = require("express");
const routes = require("./routes");
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

app.use("", routes)

app.listen(PORT, async () => {
    console.log("App is online at port: " + PORT)
    const _db = db;
    mongoose.plugin(accessibleRecordsPlugin);
    mongoose.plugin(accessibleFieldsPlugin);
})