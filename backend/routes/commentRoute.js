const router = require("express").Router()
const { createCommentCtrl, getAllCommentsCtrl, deleteCommentCtrl, updateCommentCtrl } = require('../controllers/commentController')
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken")
const validateObjectID = require("../middlewares/validateObjectID")
// /api/comments
router.route("/")
    .post(verifyToken, createCommentCtrl)
    .get(verifyTokenAndAdmin, getAllCommentsCtrl)

// /api/comment/:id
router.route("/:id")
    .delete(validateObjectID, verifyToken, deleteCommentCtrl)
    .put(validateObjectID, verifyToken, updateCommentCtrl)

module.exports = router