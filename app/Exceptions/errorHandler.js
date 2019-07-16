const errorHandler = (err, req, res) => {
//   if (res.headersSent) {
//     return next(err)
//   }
  res.status(500)
  res.json({ error: err })
  console.log(err)
}

module.exports = errorHandler
