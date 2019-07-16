const mongoose = require('mongoose')
const FollowerSchema = require('../../database/migrations/followers_schema')

const Follower = mongoose.model('Follower', FollowerSchema)

module.exports = Follower
