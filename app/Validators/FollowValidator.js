const { body } = require('express-validator')

const FollowValidator = () => {
    return [
        body('follow_id').exists().withMessage('The follow id is required').isAlphanumeric().withMessage('Please enter a valid id'),
    ]
}

module.exports = FollowValidator
