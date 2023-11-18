const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/forgotPassword', AuthController.forgotPassword)
router.post('/verifyResetToken', AuthController.verifyResetToken)
router.post('/resetPassword', AuthController.resetPassword)

module.exports = router