require("dotenv").config()
const app = require("./src/app")
const connectToDB = require("./src/config/database")
const dns = require("dns")

dns.setServers(['1.1.1.1', '8.8.8.8']);

const PORT = process.env.PORT || 5000

connectToDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    })
    .catch((err) => {
        console.error("Failed to start server due to database error:", err.message)
        process.exit(1)
    })
