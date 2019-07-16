const User = require('../Models/User')
const Article = require('../Models/Article')
const Follower = require('../Models/Follower')
const { validationResult } = require('express-validator')

exports.follow = async (req, res) => {
    await this.checkInvalid(req, res)
    const authUser = req.authUser
    const followingId = req.body.follow_id
    try {
        const user = await User.findById({ '_id': { $ne: followingId } })
        if (user === null) throw ({ message: 'Unable to find this User account', statusCode: 404 })
        const followed = await Follower.findOne({ follower: authUser._id, following: followingId })
        if (followed) throw ({ message: 'You are already following this user', statusCode: 400 })
        const follow = new Follower({
            follower: authUser._id,
            following: followingId
        })
        follow.save((err, following) => {
            if (err || following === null) throw ({ message: 'Unable to follow this User account', statusCode: 400 })
            return res.status(201).send({
                status: 1,
                message: 'User followed successfully',
                follow
            })
        })
    } catch (error) {
        const code = error.statusCode ? error.statusCode : 404
        return res.status(code).send({
            status: 0,
            message: 'User Follow Error',
            error: error.message
        })
    }
}

exports.unfollow = async (req, res) => {
    await this.checkInvalid(req, res)
    const authUser = req.authUser
    const followingId = req.body.follow_id
    try {
        const following = Follower.find({ follower: authUser._id, following: followingId })
        if (following === null) throw ({ message: 'You are not following this user', statusCode: 404 })
        const followed = await Follower.findOne({ follower: authUser._id, following: followingId })
        if (followed === null) throw ({ message: 'You are not following this User', statusCode: 400 })
        following.remove((err, following) => {
            if (err || following === null) throw ({ message: 'Unable to Unfollow this User', statusCode: 400 })
            return res.status(200).send({
                status: 1,
                message: 'User unfollowed successfully'
            })
        })
    } catch (error) {
        const code = error.statusCode ? error.statusCode : 404
        return res.status(code).send({
            status: 0,
            message: 'User Follow Error',
            error: error.message
        })
    }
}

exports.followers = async (req, res) => {
    const authUser = req.authUser
    try {
        const following = await Follower.find({ following: authUser._id }).populate('follower')
        return res.status(200).send({
            status: 1,
            message: 'Followers retrieved successfully',
            followers: following
        })
    } catch (error) {
        return res.status(400).send({
            status: 0,
            message: 'Unable to get your followers',
            error: error.message
        })
    }
}

exports.followings = async (req, res) => {
    const authUser = req.authUser
    try {
        const following = await Follower.find({ follower: authUser._id }).populate('following')
        return res.status(200).send({
            status: 1,
            message: 'Followings retrieved successfully',
            followings: following
        })
    } catch (error) {
        return res.status(400).send({
            status: 0,
            message: 'Unable to get your followings',
            error: error.message
        })
    }
}

exports.articles = async (req, res) => {
    const authUser = req.authUser
    try {
        const articles = await Article.find({ user: authUser._id })
        return res.status(200).send({
            status: 1,
            message: 'Articles retrieved successfully',
            articles
        })
    } catch (error) {
        return res.status(400).send({
            status: 0,
            message: 'Unable to get your Articles',
            error: error.message
        })
    }
}

exports.checkInvalid = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 0,
            message: 'Validation Error',
            errors: errors.array()
        })
    }
}
