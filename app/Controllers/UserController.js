const User = require('../Models/User')

exports.users = async (req, res) => {
  const users = await User.find({})
  return res.send({
    status: 1,
    users
  })
}
