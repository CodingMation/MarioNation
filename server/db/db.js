require('dotenv').config()
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_DB)

mongoose.connection.on('connected', () => console.log('MongoDB ON'))
mongoose.connection.on('error', () => console.log('MongoDB ERROR at CONNECTION'))