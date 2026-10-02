const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")

const app = express()
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    process.env.FRONTEND_URL
].filter(Boolean)

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: allowedOrigins,
    credentials: true
}))

/* require all the routes here */
const authRouter = require("./routes/auth.routes")
const interviewRouter = require("./routes/interview.routes")


/* using all the routes here */
app.use("/api/auth", authRouter)
app.use("/api/interview", interviewRouter)

/* centralized error handling middleware */
app.use((err, req, res, next) => {
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            message: "File size exceeds the 3MB limit."
        })
    }
    if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({
            message: err.message || "Only PDF files are allowed."
        })
    }
    const statusCode = err.statusCode || err.status || 500
    return res.status(statusCode).json({
        message: err.message || "Internal Server Error"
    })
})

module.exports = app
