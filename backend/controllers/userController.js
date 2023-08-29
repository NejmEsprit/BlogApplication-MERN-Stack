const asyncHandler = require("express-async-handler")
const bcrypt = require("bcryptjs")
const path = require("path")
const fs = require("fs")
const { User, validateUpdateUser } = require("../models/User")
const { cloudinaryUpoadImage, cloudinaryRemoveImage, cloudinaryRemoveMultpleImage } = require("../utils/cloudinary")
const { Comment } = require("../models/Comment")
const { Post } = require('../models/Post')
/**--------------------------
 desc : Get All User Profile
 router : /api/users/profile
 method :GET
 access: Private(only admin)
 ------------------------*/
module.exports.getAllUsersCtrl = asyncHandler(async (req, res) => {

    const users = await User.find()
        .select("-password")
        .populate("posts")
    res.status(200).json(users)
})

/**--------------------------
 desc : Get User Profile
 router : /api/users/profile/:id
 method :GET
 access: Public
 ------------------------*/
module.exports.getUserProfileById = asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.params.id })
        .populate("posts")
        .select("-password")
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }
    res.status(200).json(user)
})

/**--------------------------
@desc : Put User Profile
@router : /api/users/profile/:id
@method :PUT
@access: Private(only user himself)
------------------------*/

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
    const { error } = validateUpdateUser(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }
    const updateUser = await User.findByIdAndUpdate(
        req.params.id,
        {
            $set: {
                username: req.body.username,
                password: req.body.password,
                bio: req.body.bio,
            }
        }, { new: true }
    ).select("-password")
        .populate("posts")

    res.status(200).json(updateUser)
})

/**--------------------------
@desc : Get User Profile
@router : /api/users/profile/:id
@method :GET
@access: Public
 ------------------------*/
// module.exports.getUserProfileById = asyncHandler(async (req, res) => {
//     let myId = req.params.id
//     const user = await User.findById({ _id: myId }).select("-password")
//     if (!user) {
//         return res.status(404).json({ message: "user not found" })
//     }
//     res.status(200).json(user)
// })

/**--------------------------
@desc : Get User count
@router : /api/users/count
@method :GET
@access: Private (only admin)
 ------------------------*/
module.exports.getUserCountCtrl = asyncHandler(async (req, res) => {
    const count = await User.count()
    res.status(200).json(count)
})

/**--------------------------
@desc : Profile Photo Upload
@router : /api/users/profile/profile-photo-upload
@method :POST
@access: Private (only logged in user)
------------------------*/
module.exports.profilePhotoUploadCtrl = asyncHandler(async (req, res) => {
    //1.Validation
    if (!req.file) {
        return res.status(400).json({ message: "no file proided" })
    }
    //2. Get the path to the image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    //3.upload to cloudinary
    const result = await cloudinaryUpoadImage(imagePath);
    //console.log(result)
    //4.Get the user from DB
    const user = await User.findById(req.user.id)
    //5.Delete the old profile photo of exist
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    //6.Change th eprofile photo filed in the DB
    user.profilePhoto = {
        url: result.secure_url,
        publicId: result.public_id
    }
    await user.save()
    //7.Send respense to client  
    res.status(200).json({
        message: " your profile photo uploaded successfully",
        profilePhoto: { url: result.secure_url, publicId: result.public_id }
    })

    //8. Remove image from the server
    fs.unlinkSync(imagePath)

})
/**--------------------------
@desc : Delete User Profile
@router : /api/users/profile/:id
@method :DELETE
@access: Private (inly admin or user himself)
 ------------------------*/

module.exports.deleteUserProfileCtrl = asyncHandler(async (req, res) => {
    //1. get the user fromDB 
    const user = await User.findById(req.params.id)
    if (!user) {
        return res.status(404).json({ message: "user not found" })
    }

    //2. get all post from  
    const posts = await Post.find({ user: user._id })
    //3. get the public IDs from the posts 
    const publicIds = posts?.map((post) => post.image.publicId)
    //4. delete all posts image from cloudinary that belog to this user 
    if (publicIds?.length > 0) {
        await cloudinaryRemoveMultpleImage(publicIds)
    }
    //5. delete the profile pictre from clouinary
    if (user.profilePhoto.publicId !== null) {
        await cloudinaryRemoveImage(user.profilePhoto.publicId)
    }
    //6. delete user posts &comments 
    await Post.deleteMany({ user: user._id })
    await Comment.deleteMany({ user: user._id })
    //7. delete the user himself
    await User.findByIdAndDelete(req.params.id)
    //8. send a response to the client 
    res.status(200).json({ message: "your profile has been deletes" })
})