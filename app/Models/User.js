const mongoose = require('mongoose')
const UserSchema = require('../../database/migrations/user_schema')

UserSchema.methods.toJSON = function () {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}
const User = mongoose.model('User', UserSchema)

module.exports = User
