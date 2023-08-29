const mongoose = require("mongoose")

module.exports= async()=>{
    try {
        await mongoose.connect(process.env.MONGO_CLOUD_URL)
        console.log("conection to MongoDB")
        
    } catch (error) {
        console.log("connection failed to MongoDB", error)
        
    }
}