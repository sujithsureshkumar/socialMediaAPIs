const express = require('express')
const mongoose = require('mongoose')
//const url = 'mongodb://127.0.0.1/SocialDB'
const url = 'mongodb+srv://sujith:1234567890@clustersujith.oplqxxi.mongodb.net/?retryWrites=true&w=majority'

const app = express()

mongoose.connect(url, {useNewUrlParser:true})
const con = mongoose.connection

con.on('open', () => {
    console.log('connected...')
})

app.use(express.json())

const apiRouter = require('./routes/api.js')
app.use('/api',apiRouter)

app.listen(9000, () => {
    console.log('Server started')
})