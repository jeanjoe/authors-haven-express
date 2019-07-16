const Article = require('../Models/Article')
const { validationResult } = require('express-validator')

exports.index = async (req, res) => {
    const articles = await Article.find({}).where({ status: true }).populate('user')
    return res.status(200).send({
        status: 1,
        message: 'Articles retrieved successfully',
        articles
    })
}

exports.create = async (req, res) => {
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).send({
            status: 0,
            message: 'Validation Error',
            errors: errors.array()
        })
    }
    const data = req.body
    const authUser = req.authUser
    const article = await new Article({
        user: authUser._id,
        title: data.title,
        description: data.description,
        body: data.body,
        tags: data.tags,
    })
    article.save((err, article) => {
        return res.status(201).send({
            status: 1,
            message: 'Article created successfully',
            article
        })
    })
}

exports.show = async (req, res) => {
    const articleId = req.params.id
    try {
        const article = await Article.findById(articleId).populate('user')
        if (article === null) throw ({ message: 'Unable to find this article' })
        return res.status(200).send({
            status: 1,
            message: 'Article retrieved successfully',
            article
        })
    } catch (error) {
        return res.status(404).send({
            status: 0,
            message: 'Article not Found',
            error: error.message
        })
    }
}

exports.update = async (req, res) => {
    const articleId = req.params.id
    const authUser = req.authUser
    const data = req.body
    try {
        const article = await Article.findById(articleId).where({ 'user': authUser._id })
        if (article === null) throw ({ message: 'Unable to find this article' })
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).send({
                status: 0,
                message: 'Validation Error',
                errors: errors.array()
            })
        }
        let statusCode = 200, status = 1, message = 'Article updated successfully'
        article.updateOne({
            user: authUser._id,
            title: data.title,
            description: data.description,
            body: data.body,
            tags: data.tags,
        }, (err, article) => {
            if (err || article === null) {
                status = 0
                statusCode = 404
                message = 'Article Not Found'
            }
        })
        return res.status(statusCode).send({ status, message, article })
    } catch (error) {
        return res.status(404).send({
            status: 0,
            message: 'Article not Found',
            error: error.message
        })
    }
}

exports.delete = async (req, res) => {
    const articleId = req.params.id
    const authUser = req.authUser
    Article.findByIdAndDelete(articleId, (err, article) => {
        let statusCode = 200
        let status = 1
        let message = 'Article deleted successfully'
        if (err || article === null) {
            status = 0
            statusCode = 404
            message = 'Article Not Found'
        }
        return res.status(statusCode).send({ status, message })
    }).where({ 'user': authUser._id })
}
