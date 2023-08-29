const fs = require("fs")
const path = require("path")
const asyncHandler = require("express-async-handler")
const { Post, validationCreatePost, validationUpdatePost } = require("../models/Post")
const { cloudinaryUpoadImage, cloudinaryRemoveImage } = require('../utils/cloudinary')
const { Comment } = require("../models/Comment")

/**--------------------------
@desc : create new post
@router : /api/posts
@method :POST
@access: Private(only logged in user)
------------------------*/
module.exports.createPostCtrl = asyncHandler(async (req, res) => {
    //1.validation for image 
    if (!req.file) {
        return res.status(400).json({ message: "no image provided" })
    }
    //2.validation for data 
    const { error } = validationCreatePost(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    //3.upload photo
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`);
    const result = await cloudinaryUpoadImage(imagePath);
    //4.create new post save it to DB
    const post = await Post.create({
        title: req.body.title,
        description: req.body.description,
        category: req.body.category,
        user: req.user.id,
        image: {
            url: result.secure_url,
            publicId: result.public_id,
        },
    })
    //5.send response to client 
    res.status(201).json(post);
    //6.remove image from the server
    fs.unlinkSync(imagePath)
})

/**--------------------------
@desc : GET All post
@router : /api/posts
@method :GET
@access: Public
------------------------*/
module.exports.getAllPsotsCtrl = asyncHandler(async (req, res) => {
    const POST_PER_PAGE = 3;
    const { pageNumber, category } = req.query
    let posts
    if (pageNumber) {
        posts = await Post.find()
            .skip((pageNumber - 1) * POST_PER_PAGE)
            .limit(POST_PER_PAGE)
            .sort({ createdAt: -1 })
            .populate("user", ["-password"])
    } else if (category) {
        posts = await Post.find({ category })
            .sort({ createdAt: -1 })
            .populate("user", ["-password"])
    } else {
        posts = await Post.find()
            .sort({ createdAt: -1 })
            .populate("user", ["-password"])
    }
    res.status(200).json(posts)
})

/**--------------------------
@desc : GET Singel post
@router : /api/posts/:id
@method :GET
@access: Public
------------------------*/
module.exports.getSinglePsotsCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
        .populate("user", ["-password"])
        .populate("comments")
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }
    res.status(200).json(post)
})

/**--------------------------
@desc : GET Post count
@router : /api/posts/count
@method :GET
@access: Public
------------------------*/
module.exports.getPostCountCtrl = asyncHandler(async (req, res) => {
    const count = await Post.count()
    res.status(200).json(count)
})

/**--------------------------
@desc : Delete post
@router : /api/posts/:id
@method :DELETE
@access: Private (only admin or owner of the post)
------------------------*/
module.exports.deletePostCtrl = asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404).json({ message: "post not found " })
    }
    if (req.user.isAdmin || req.user.id === post.user.toString()) {
        await Post.findByIdAndDelete(req.params.id)
        await cloudinaryRemoveImage(post.image.publicId)
        // delete all comments that belong to this post
        await Comment.deleteMany({ postId: post._id })
        res.status(200).json({ message: "post has been deleted succesfuly", postId: post._id })
    } else {
        res.status(403).json({ message: "acces denied, forbidden" })
    }
})

/**--------------------------
@desc : Update post
@router : /api/posts/:id
@method :PUT
@access: Private (owner of the post)
------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
    //1. validation 
    const { error } = validationUpdatePost(req.body)
    if (error) {
        res.status(400).json({ message: error.details[0].message })
    }
    //2.Get the post from DB and check if post exist
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404).json({ message: "post not found" })
    }

    //3.check if this post belong to logged in user
    if (req.user.id !== post.user.toString()) {
        res.status(403).json({ message: "acces denied , your are not allowed" })
    }
    //4.update post 
    const updatePost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category
        }
    }, { new: true }).populate("user", ["-password"])
    //5.send response to the client
    res.status(200).json({ updatePost })
})
/**--------------------------
@desc : Update Post Image
@router : /api/posts/upload-image/:id
@method :PUT
@access: Private (owner of the post)
------------------------*/
module.exports.updatePostImageCtrl = asyncHandler(async (req, res) => {
    //1.validation 
    if (!req.file) {
        res.status(400).json({ message: "no image provider" })
    }
    //2. Get the post from DB and check if post exist 
    const post = await Post.findById(req.params.id)
    if (!post) {
        res.status(404).json({ message: "post not found" })
    }
    //3.check if this post belong to logged in user
    if (req.user.id !== post.user.toString()) {
        res.status(403).json({ message: "acces denied , your are not allowed" })
    }
    //4. delete the old image 
    await cloudinaryRemoveImage(post.image.publicId);
    //5.Update Post Image
    const imagePath = path.join(__dirname, `../images/${req.file.filename}`)
    const result = await cloudinaryUpoadImage(imagePath)
    //6.update the image field in the DB 
    const updateImage = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
            image: {
                url: result.secure_url,
                publicId: result.publicId
            }
        }
    }, { new: true })
    //7.send response to the client
    res.status(200).json({ updateImage })
    //8.remove image from the server
    fs.unlinkSync(imagePath)
})

/**--------------------------
@desc : Toggle Like
@router : /api/posts/like/:id
@method :PUT
@access: Private (only logged in user)
------------------------*/
module.exports.toggleLikeCtrl = asyncHandler(async (req, res) => {
    let post = await Post.findById(req.params.id)
    if (!post) {
        return res.status(404).json({ message: "post not found" })
    }
    const isPostAleadyLiked = post.likes.find((user) => user.toString() === req.user.id)
    if (isPostAleadyLiked) {
        post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likes: req.user.id }
            },
            { new: true })
    } else {
        post = await Post.findByIdAndUpdate(
            req.params.id,
            {
                $push: { likes: req.user.id }
            },
            { new: true })

    }
    res.status(200).json(post)
})
