const express = require('express')
const router = express.Router()
const carCategoryController = require('../controller/categories.controller')
const auth = require('../../users/middlewares/userAuth')

router.post('/api/car/category', auth , carCategoryController.addCategory)
router.patch('/api/car/category/:id', auth , carCategoryController.updateCategory)
router.delete('/api/car/category/:id', auth , carCategoryController.deleteCategory)
router.get('/api/car/category/:id', auth , carCategoryController.getCategoryById)
router.get('/api/car/categories/view', auth , carCategoryController.getAllCategories)
 
module.exports = router