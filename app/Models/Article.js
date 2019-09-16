const mongoose = require('mongoose')
const ArticleSchema = require('../../database/migrations/articles_schema')

const Article = mongoose.model('Article', ArticleSchema)

module.exports = Article
