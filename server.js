const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({ path: path.join(__dirname, '/.env') })
const Router = require('./routes/router')
const errorHandler = require('./app/Exceptions/errorHandler')
const app = express()
const db = require('./config/database')
const port = process.env.PORT || 3333
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')

db()
app.use(helmet())
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'))
}
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use('/api', Router)
app.use(errorHandler)

app.listen(port)

module.exports = app
