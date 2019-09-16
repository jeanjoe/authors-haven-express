const { body } = require('express-validator')

const ArticleValidator = () => {
    return [
        body('title').exists().withMessage('Title is required').isLength({max: 150}).withMessage('Title must be at most 150 chars').escape(),
        body('description').exists().withMessage('Description is required').isLength({max: 150}).withMessage('Description must be at most 150 chars').escape(),
        body('body').exists().withMessage('Article Body is required').isLength({max: 5000}).withMessage('Body must be at most 5000 chars').escape(),
        body('tags').exists().withMessage('Tags are required').isArray().withMessage('Tags must be an array'),
    ]
}

module.exports = ArticleValidator
