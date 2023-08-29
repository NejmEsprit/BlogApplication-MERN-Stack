const mongoose = require('mongoose')
const Joi = require('joi')
 // Category Schema 
 const CategorySchema =new mongoose.Schema({
    user :{
        type :mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    },
    title : {
        type :String,
        required:true,
        trim: true,
    }
 },{
    timestamps:true
 })
 // Category Model
 const Categry =mongoose.model('Category', CategorySchema)
 // validate create Category
 function validateCreateCategory(obj){
    const shema =Joi.object({
        title:Joi.string().trim().required()
    })
    return shema.validate(obj)
 } 
 module.exports={
    Categry,
    validateCreateCategory
 }