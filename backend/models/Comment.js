const mongoose=require("mongoose")
const Joi = require("joi")

//comment Schema
const CommentSchema =new mongoose.Schema({
    postId:{
        type :mongoose.Schema.Types.ObjectId,
        ref :"Post",
        require: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    },
    text:{
        type: String,
        require:true
    },
    username:{
        type: String,
        require:true
    },
},{
    timestamps :true
})
//comment model
const Comment=mongoose.model("Comment",CommentSchema)
//validate Create Comment
function validateCreateComment(obj){
    const schema= Joi.object({
        postId:Joi.string().required().label('Post Id'),
        text: Joi.string().required().label('TEXT')
    })
    return schema.validate(obj)
}
//validate update Comment
function validateUpdateComment(obj){
    const schema= Joi.object({
        text: Joi.string().required()
    })
    return schema.validate(obj)
}
module.exports={
    Comment,
    validateCreateComment,
    validateUpdateComment
}