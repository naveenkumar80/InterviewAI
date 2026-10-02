const jwt = require("jsonwebtoken")
const tokenBlacklistModel = require("../models/blacklist.model")



async function authUser(req, res, next) {
    try {
        const token = req.cookies?.token || req.headers.authorization?.replace(/^Bearer\s+/i, "")

        if (!token) {
            return res.status(401).json({
                message: "Authentication required. Token not provided."
            })
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({
            token
        })

        if (isTokenBlacklisted) {
            return res.status(401).json({
                message: "Token is no longer valid. Please log in again."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (err) {
        return res.status(401).json({
            message: "Invalid or expired token."
        })
    }
}


module.exports = { authUser }