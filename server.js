const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config()
const homeRoute = require('./routes/home')
const userRoute = require('./routes/user')
const { default: axios } = require("axios")
const app = express()

//connect local database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: false
}).then(() => console.log('Connected to Database'))
.catch((err) => console.log(err))

//middleware
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))

app.get('/a', (req, res) => {
    res.send("HELLO")
})

app.get('/1', (req, res) => {
    axios({
        method: 'get',
        url: 'https://api.line.me/v2/bot/profile/Ub634849bab4716a9a7dd54484fbe6207',
        headers: {
            Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
        }
    })
    .then(response => {
        console.log(response.data)
    })
    .catch(err => {
        console.log(err)
    })
})

//route
app.use("/api", homeRoute)
app.use("/userApi", userRoute)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Start server in port ${port}`)
})