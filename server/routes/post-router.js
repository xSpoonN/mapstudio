const express = require('express')
const router = express.Router()
const PostController = require('../controllers/post-controller')
const auth = require('../auth')

router.post('/post', auth.verify, PostController.createPost)
router.get('/allposts', PostController.getPosts)
router.put('/post/:id', auth.verify, PostController.updatePost)
router.get('/post/:id', auth.verify, PostController.getPost)
router.get('/user/:id', PostController.getPostsByUser)

module.exports = router