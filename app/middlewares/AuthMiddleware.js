const jwt = require('jsonwebtoken')
const User = require('../Models/User')

exports.userAuth = (req, res, next) => {
    if (req.headers['authorization']) {
        const token = req.headers.authorization.split(' ')
        if (token[0] !== 'Bearer') {
            return res.status(403).send({
                status: 0,
                message: 'Authorization Error',
                error: 'Your token is missing Bearer'
            })
        } else {
            try {
                jwt.verify(token[1], process.env.APP_KEY)
                const decodedUser = jwt.decode(token[1])
                User.findById(decodedUser.user._id, (err, res) => {
                    if (err) {
                        return res.status(403).send({
                            status: 0,
                            message: 'Authorization Error',
                            error: 'Unable to verify this user'
                        })
                    }
                    req.authUser = res
                    next()
                })
            } catch (error) {
                return res.status(401).send({
                    status: 0,
                    message: 'Authorization Error',
                    error: (error.message).toUpperCase()
                })
            }
        }
    } else {
        return res.status(403).send({
            status: 0,
            message: 'Authorization required',
            error: 'Provide a valid token to access this resource'
        })
    }
}
