const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const mongoose = require("mongoose")
require('dotenv').config()
const homeRoute = require('./routes/home')
const userRoute = require('./routes/user')
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

app.get('/', (req, res) => {
    res.send("HELLO")
})

//route
app.use("/api", homeRoute)
app.use("/userApi", userRoute)

const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Start server in port ${port}`)
})