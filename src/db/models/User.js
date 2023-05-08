const mongoose = require("mongoose");
const { accessibleRecordsPlugin, accessibleFieldsPlugin } = require('@casl/mongoose')

const UserSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    clientSecret: { type: String, required: true },
    roleName: { type: String, required: true}
}, { timestamps: true });

UserSchema.plugin(accessibleRecordsPlugin)
UserSchema.plugin(accessibleFieldsPlugin)

module.exports = mongoose.model("User", UserSchema)