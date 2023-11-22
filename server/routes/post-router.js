const express = require('express')
const router = express.Router()
const PostController = require('../controllers/post-controller')
const auth = require('../auth')

router.post('/post', auth.verify, PostController.createPost)
router.get('/allposts', PostController.getPosts)

module.exports = router