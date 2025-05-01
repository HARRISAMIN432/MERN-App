const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

dotenv.config({path: 'backend/config/config.env'})
connectDatabase()

process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to uncaught exception')
    process.exit(1)
})

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
})

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`)
    console.log('Shutting down the server due to uncaught exception')
    process.exit(1)
})