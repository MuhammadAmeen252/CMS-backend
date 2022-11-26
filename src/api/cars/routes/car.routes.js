const express = require('express')
const router = express.Router()
const carController = require('../controller/car.controller')
const auth = require('../../users/middlewares/userAuth')

router.post('/api/car', auth , carController.addCar)
router.patch('/api/car/:id', auth , carController.updateCar)
router.delete('/api/car/:id', auth , carController.deleteCar)
router.get('/api/car/:id', auth , carController.getCarById)
router.get('/api/cars', auth , carController.getAllCars)
 
module.exports = router