const express = require('express')
const router = express.Router()
const AuthController = require('../controllers/auth-controller')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.post('/register', AuthController.registerUser)
router.post('/login', AuthController.loginUser)
router.get('/logout', AuthController.logoutUser)
router.get('/loggedIn', AuthController.getLoggedIn)
router.post('/forgotPassword', AuthController.forgotPassword)
router.post('/verifyResetToken', AuthController.verifyResetToken)
router.post('/resetPassword', AuthController.resetPassword)
router.post('/users/pfp/:email', upload.single('profilePicture'), AuthController.setProfilePicture)
router.get('/users/:email', AuthController.getUser)
router.post('/users/bio/:email', AuthController.setBio)

module.exports = router