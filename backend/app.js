const express = require('express')

const app = express()

const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middleware/error')

app.use(express.json())
app.use(cookieParser())
const productRoute = require('./routes/productRoute')
const userRoute = require('./routes/userRoutes')
const orderRoute = require('./routes/orderRoute')

app.use('/api/v1', productRoute)
app.use('/api/v1', userRoute)
app.use('/api/v1', orderRoute)

app.use(errorMiddleware)

module.exports = app