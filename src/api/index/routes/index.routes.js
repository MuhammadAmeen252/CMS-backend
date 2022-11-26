const express = require('express')
const router = express.Router()
const indexController = require('../controller/index.controller')
const userAuth = require('../../users/middlewares/userAuth')

router.get('/api', userAuth ,indexController.index)

module.exports = router 