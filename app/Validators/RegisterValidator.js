const { body } = require('express-validator')

const RegisterValidator = () => {
    return [
        body('username').exists().withMessage('Username is Required'),
        body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
        body('password').exists().withMessage('Password is required')
        .isLength({ min: 6, max: 20 }).withMessage('Password must be at least 6 chars and maximum 20 chars')
    ]
}

module.exports = RegisterValidator
