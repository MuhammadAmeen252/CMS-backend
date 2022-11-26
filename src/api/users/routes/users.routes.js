const express = require('express')
const router = express.Router()
const userController = require('../controller/users.controller')
const userAuth = require('../middlewares/userAuth')

router.get('/api',userController.index)
router.post('/api/user/register',userController.registerUser)
router.post('/api/user/login',userController.loginUser)
router.post('/api/user/logout', userAuth ,userController.logoutUser)
router.delete('/api/user/delete', userAuth,userController.deleteMyAccount)
router.patch('/api/user/update', userAuth,userController.updateProfile)
router.patch('/api/user/changePassword', userAuth ,userController.changePassword)
router.get('/api/user/viewProfile', userAuth ,userController.viewMyProfileInfo)

module.exports = router 