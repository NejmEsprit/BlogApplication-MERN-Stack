const asyncHandler = require("express-async-handler")
const { Comment, validateCreateComment, validateUpdateComment } = require('../models/Comment')
const { User } = require('../models/User')

/**--------------------------
@desc : create new Comment
@router : /api/comments
@method :POST
@access: Private(only logged in user)
------------------------*/
module.exports.createCommentCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateComment(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const profile = await User.findById(req.user.id)
    const comment = await Comment.create({
        postId: req.body.postId,
        text: req.body.text,
        user: req.user.id,
        username: profile.username
    })
    res.status(201).json(comment)
})

/**--------------------------
@desc : GET All Comments
@router : /api/comments
@method :GET
@access: Private(only admin)
------------------------*/
module.exports.getAllCommentsCtrl = asyncHandler(async (req, res) => {
    const Comments = await Comment.find().populate('user', ["-password"])
    return res.status(200).json(Comments)
})

/**--------------------------
@desc : Delete Comments
@router : /api/comments/:id
@method :DELETE
@access: Private(only admin or owner of the comment)
------------------------*/
module.exports.deleteCommentCtrl = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(404).json({ message: 'comment not found' })
    }
    if (req.user.isAdmin || req.user.id === comment.user.toString()) { // on peut eliminer _id car User de type objectId
        await Comment.findByIdAndDelete(req.params.id)
        return res.status(200).json({ message: 'comment has been deleted' })
    } else {
        return res.status(403).json({ message: 'acces denied , not allowed' })
    }
})

/**--------------------------
@desc : Update Comments
@router : /api/comments/:id
@method :PUT
@access: Private(owner of the comment)
------------------------*/
module.exports.updateCommentCtrl = asyncHandler(async (req, res) => {
    const { error } = validateUpdateComment(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const comment = await Comment.findById(req.params.id)
    if (!comment) {
        return res.status(404).json({ message: 'comment not found' })
    }
    if (req.user.id === comment.user.toString()) {
        const commentUpdate = await Comment.findByIdAndUpdate(req.params.id, {
            $set: {
                text: req.body.text
            }
        },{new :true})
        res.status(200).json(commentUpdate)
    } else {
        return res.status(403).json({ message:" acces denied , only user himself can etid his comment" })
    }
})

