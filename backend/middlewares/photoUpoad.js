const path = require("path")
const multer = require("multer")
const { date } = require("joi")
//lien :https://console.cloudinary.com/console/c-476738baed5bd2a8bdb689bfd10a86/media_library/folders/home
//photo Storage
const photoStorage = multer.diskStorage({
    destination: function (req, req, cb) {
        cb(null, path.join(__dirname, "../images"))
    },
    filename: function (req, file, cb) {
        if (file) {
            cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
        } else {
            cb(null, false)
        }
    }
})

//photo Upload Middleware
const photoUpoad = multer({
    storage: photoStorage,
    fileFilter: function (req, file, cb){
        if(file.mimetype.startsWith("image")){
            cb(null,true)
        } else {
            cb({ message : " unsupported file format "}, false)
        }
    },
    limits: { fileSize :1024*1024} // 1 megabyte
})

module.exports= photoUpoad