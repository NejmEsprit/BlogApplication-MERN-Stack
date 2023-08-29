const mongoose = require("mongoose")
const joi = require("joi")
const jwt = require("jsonwebtoken")
//const passwordComplexity =require("npm i joi-password-complexity")

//User  Schema
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        require: true,
        trim: true,
        minlength: 5,
        maxlength: 100,
        unique: true
    },
    password: {
        type: String,
        require: true,
        trim: true,
        minlength: 8,
    },
    profilePhoto: {
        type: Object,
        default: {
            url: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__480.png",
            publicId: null
        }
    },
    bio: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }

    })

//populate Postd that belong to this user when he get his profile
UserSchema.virtual("posts", {
    ref: "Post",
    foreignField: "user",
    localField: "_id",
})
//generate Auth Token 
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, process.env.JWT_SECRET)

}
// User model
const User = mongoose.model("User", UserSchema)

// validate register User
function validateRegisterUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100).required(),
        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}
// validate login User
function validateLoginUser(obj) {
    const schema = joi.object({

        email: joi.string().trim().min(5).max(100).required().email(),
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}
// validate update User
function validateUpdateUser(obj) {
    const schema = joi.object({
        username: joi.string().trim().min(2).max(100),
        password: joi.string().trim().min(8),
        bio: joi.string()
    })
    return schema.validate(obj)
}
// validate Eamil 
function validateEmail(obj) {
    const schema = joi.object({
        email: joi.string().trim().min(5).max(100).required().email(),
    })
    return schema.validate(obj)
}// validate new Password
function validateNewPassword(obj) {
    const schema = joi.object({
        password: joi.string().trim().min(8).required()
    })
    return schema.validate(obj)
}

module.exports = {
    User,
    validateRegisterUser,
    validateLoginUser,
    validateUpdateUser,
    validateEmail,
    validateNewPassword,
}