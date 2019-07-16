const Schema = require('mongoose').Schema

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  account_type: { type: String, required: true, default: 'author' }
}, { timestamps: true })

module.exports = UserSchema
