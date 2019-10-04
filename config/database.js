const mongoose = require('mongoose')
const chalk = require('chalk')
let dbURL = process.env.DATABASE_URL
const connected = chalk.bold.cyan
const error = chalk.bold.yellow
const disconnected = chalk.bold.red
const termination = chalk.bold.magenta

if (process.env.NODE_ENV == 'test') {
  dbURL = process.env.TEST_DATABASE_URL
}

const connection = () => {
  mongoose.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })

  mongoose.connection.on('connected', () => {
    console.log(connected('Mongoose default connection is open :)'))
  })

  mongoose.connection.on('error', err => {
    console.log(error('Mongoose default connection has occured ' + err + ' error'))
  })

  mongoose.connection.on('disconnected', () => {
    console.log(disconnected('Mongoose default connection is disconnected'))
  })

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log(termination('Mongoose default connection is disconnected due to application termination'))
      process.exit(0)
    })
  })
}

module.exports = connection
