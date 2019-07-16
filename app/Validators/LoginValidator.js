const { body } = require('express-validator')

const LoginValidator = () => {
    return [
        body('email').isEmail().withMessage('Please enter a valid email address'),
        body('password').exists().withMessage('Password is required'),
    ]
}

module.exports = LoginValidator
