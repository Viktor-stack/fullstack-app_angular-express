const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const mongoose = require('mongoose')
const keys = require('./config/keys')
const authRoutes = require('./routes/auth')
const appIndex = require('./routes/appIndex')
const categoryRouter = require('./routes/category')
const positionRouter = require('./routes/position')
const analyticsRouter = require('./routes/analytics')
const orderRouter = require('./routes/order')
const app = express()

mongoose.set('useCreateIndex', true)
mongoose.connect(
  keys.mongooURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  }).then(() => {
  console.log('MongooDB connected!!!')
}).catch(error => {
  console.log(error)
})

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(require('morgan')('dev'))
app.use('/uploads', express.static('uploads'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(require('cors')())

app.use('/', appIndex)
app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRouter)
app.use('/api/order', orderRouter)
app.use('/api/analytics', analyticsRouter)
app.use('/api/position', positionRouter)


module.exports = app