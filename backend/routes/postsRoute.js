const router = require("express").Router();
const { createPostCtrl, getAllPsotsCtrl, getSinglePsotsCtrl, getPostCountCtrl, deletePostCtrl, updatePostCtrl, updatePostImageCtrl, toggleLikeCtrl } = require("../controllers/postController");
const photoUpload = require("../middlewares/photoUpoad")
const { verifyToken } = require("../middlewares/verifyToken")
const validateObjectId = require("../middlewares/validateObjectID")

// /api/posts
router.route("/")
    .post(verifyToken, photoUpload.single("image"), createPostCtrl)
    .get(getAllPsotsCtrl)

// /api/posts/count
router.route("/count").get(getPostCountCtrl)
// /api/posts/:id
router.route("/:id")
    .get(validateObjectId, getSinglePsotsCtrl)
    .delete(validateObjectId, verifyToken, deletePostCtrl)
    .put(validateObjectId, verifyToken, updatePostCtrl)
// /api/posts/update-image/:id
router.route("/update-image/:id")
    .put(validateObjectId, verifyToken, photoUpload.single("image"), updatePostImageCtrl)
// /api/posts/like/:id
router.route("/like/:id")
    .put(validateObjectId, verifyToken, toggleLikeCtrl)

module.exports = router