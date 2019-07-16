const Schema = require('mongoose').Schema

const FollowerSchema = new Schema({
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true })

module.exports = FollowerSchema
