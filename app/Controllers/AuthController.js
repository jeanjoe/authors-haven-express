const User = require('../Models/User')
const Bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')

exports.login = async function (req, res) {
  const errors = await validationResult(req);
  const expiresIn = 5 * 60
  if (!errors.isEmpty()) {
    return res.status(422).send({
      status: 0,
      message: 'Validation Error',
      errors: errors.array()
    })
  }
  const user = await User.findOne({email: req.body.email})
  if (user) {
    const verify = await Bcrypt.compare(req.body.password, user.password)
    if (verify) {
      const token = await jwt.sign({user}, process.env.APP_KEY, { expiresIn })
      return res.status(200).send({
        status: 1,
        message: 'Login Successfull.',
        user,
        token
      })
    }
  }
  return res.status(400).send({
    status: 0,
    message: 'Wrong email or password'
  });
};

exports.registerUser = async (req, res) => {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({
      status: 0,
      message: 'Validation Error',
      errors: errors.array()
    })
  }
  const data = req.body;
  const user = await User.find({ email: data.email });
  if (user.length > 0) {
    return res.status(422).send({
      status: 0,
      message: 'This Email address is already registered!'
    });
  } else {
    const insertUser = await new User({
      username: data.username,
      email: data.email,
      password: await Bcrypt.hash(data.password, 10),
      account_type: 'author'
    });
    insertUser.save();
    return res.status(201).send({
      status: 1,
      message: 'User account has been created successfully',
      user: insertUser
    })
  }
}
