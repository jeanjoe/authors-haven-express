const Schema = require('mongoose').Schema

const ArticleSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    tags: { type: Array, required: true },
    body: { type: String, required: true },
    status: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = ArticleSchema