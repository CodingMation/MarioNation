// require('dotenv').config()
const express = require('express')
const cors = require('cors')

const db = require('./db/db')

const userRouter = require('./routes/user')
const subjectRouter = require('./routes/subject')
const chapterRouter = require('./routes/chapter')
const exerciseRouter = require('./routes/exercise')
const materialRouter = require('./routes/material')

const app = express()
app.use(express.json())
app.use(cors())

app.use("/u", express.static("uploads"));

app.use('/api/user', userRouter)
app.use('/api/subject', subjectRouter)
app.use('/api/chapter', chapterRouter)
app.use('/api/exercise', exerciseRouter)
app.use('/api/material', materialRouter)

app.get('/', (req,res) => res.send({name:'syhte', agee: 20}))

const port = 5000;
const host = '0.0.0.0';

app.listen(port, host, () => { console.log(`Server live on http://${host}:${port}`); });
