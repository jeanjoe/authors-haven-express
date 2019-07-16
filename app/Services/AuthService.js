const jwt = require('jsonwebtoken')

exports.tokenUser = (req) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        return jwt.decode(token)
    } catch (error) {
        return null
    }
}
