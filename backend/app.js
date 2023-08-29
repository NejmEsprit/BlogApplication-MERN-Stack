//run server :npm run dev
const express = require("express")
const connectToDb = require("./config/connectToDB")
// const xss = require("xss-clean")
// const rateLimiting = require("express-rate-limit")
// const helmet = require("helmet")
// const hpp = require("hpp")
const { errorHandler, notFound } = require("./middlewares/error")
const cors = require("cors")
require("dotenv").config()

// connectio to DB 
connectToDb()
// init app
const app = express()

//middlwares
app.use(express.json())
//security Headers (helmet)
//app.use(helmet())
//Prevent Http Param Pollution
//app.use(hpp())

//Prevent XSS(cross site Scripting) attacks
//app.use(xss())

//Rate Limiting 
// app.use(rateLimiting({
//     windowMs: 10 * 60 * 1000, //10 minutes
//     max: 100,
// }))

//cors Policy
app.use(cors({
    origin: "http://localhost:3000"
}))

// routes 
app.use("/api/auth", require("./routes/authRoute"))
app.use("/api/users", require("./routes/usersRoute"))
app.use("/api/posts", require("./routes/postsRoute"))
app.use("/api/comments", require("./routes/commentRoute"))
app.use("/api/categories", require("./routes/categoryRoute"))
app.use("/api/password", require("./routes/passwordRoute"))
//
//Error Handler Middleware
app.use(notFound)
app.use(errorHandler)

//running the server
const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`server is runnig in ${process.env.NODE_ENV} mode on port ${PORT}`))


