const multer = require("multer")


const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 3 * 1024 * 1024 // 3MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
            cb(null, true)
        } else {
            const err = new Error("Only PDF files are allowed")
            err.code = "INVALID_FILE_TYPE"
            cb(err, false)
        }
    }
})


module.exports = upload