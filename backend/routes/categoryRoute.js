const router = require("express").Router()
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken")
const { createCategoryCtrl, getAllCategoryCtrl, deleteCategoryCtrl } = require("../controllers/CategoryController")
const validateObjectID =require ("../middlewares/validateObjectID")
// /api/categories
router.route("/")
    .post(verifyTokenAndAdmin, createCategoryCtrl)
    .get(getAllCategoryCtrl)
router.route("/:id")
    .delete(validateObjectID,verifyTokenAndAdmin, deleteCategoryCtrl)

module.exports = router