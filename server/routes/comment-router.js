const express = require('express')
const router = express.Router()
const CommentController = require('../controllers/comment-controller')
const auth = require('../auth')

router.post('/post/:id', auth.verify, CommentController.createComment)
router.post('/allcomments', CommentController.getComments)
router.put('/updatecomment/:id', auth.verify, CommentController.updateComment)

module.exports = router