const asyncHandler = require("express-async-handler")
const { Categry, validateCreateCategory } = require('../models/Category')

/**--------------------------
@desc : Create Category
@router : /api/categories
@method :POST
@access: Private (only admin)
------------------------*/
module.exports.createCategoryCtrl = asyncHandler(async (req, res) => {
    const { error } = validateCreateCategory(req.body)
    if (error) {
        return res.status(400).json({ message: error.details[0].message })
    }
    const categry = await Categry.create({
        title: req.body.title,
        user: req.user.id
    })
    res.status(201).json(categry)
})

/**--------------------------
@desc : Get Category
@router : /api/categories/:id
@method :GET
@access: public
------------------------*/
module.exports.getAllCategoryCtrl = asyncHandler(async (req, res) => {
    const categories = await Categry.find()
    res.status(200).json(categories)
})

/**--------------------------
@desc : Delete Category
@router : /api/categories
@method :DELETE
@access: Private (only admin)
------------------------*/

module.exports.deleteCategoryCtrl = asyncHandler(async (req, res) => {
    let myid = req.params.id
    const category = await Categry.findById(myid)
    if (!category) {
        res.status(404).json({ message: " categorty not found" })
    }
    await Categry.findByIdAndDelete(myid)
    res.status(200).json({ message: "category has been deleted  successfuly", categryId: category._id })
})