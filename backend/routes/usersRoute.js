const router = require("express").Router()
const { getAllUsersCtrl, updateUserProfile, getUserCountCtrl, profilePhotoUploadCtrl, deleteUserProfileCtrl, getUserProfileById } = require("../controllers/userController")
const { verifyTokenAndAdmin, verifyTokenAndOnlyUser, verifyToken, verifyTokenAndAutorization } = require("../middlewares/verifyToken")
const validateObjectId = require("../middlewares/validateObjectID")
const photoUpoad = require("../middlewares/photoUpoad")


//  /api/user/profile
router.route("/profile").get(verifyTokenAndAdmin, getAllUsersCtrl)

//  /api/user/profile/:id
router.route("/profile/:id")
    .get(validateObjectId, getUserProfileById)
    .put(validateObjectId, verifyTokenAndOnlyUser, updateUserProfile)
    .delete(validateObjectId, verifyTokenAndAutorization, deleteUserProfileCtrl)

//  /api/user/count
router.route("/count").get(verifyTokenAndAdmin, getUserCountCtrl)

//  /api/user/profile/profile-photo-upload
router.route("/profile/profile-photo-upload").post(verifyToken, photoUpoad.single("image"), profilePhotoUploadCtrl)

module.exports = router