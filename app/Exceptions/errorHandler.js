const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
}

module.exports = errorHandler
