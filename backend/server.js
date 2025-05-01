const dotenv = require('dotenv')
const app = require('./app')
const connectDatabase = require('./config/database')

dotenv.config({path: 'backend/config/config.env'})
connectDatabase()

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
})