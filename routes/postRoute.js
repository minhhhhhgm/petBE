const express = require('express');
const {
  createPost,
  getPostsFromFollowing
} = require('../controllers/postController');

const router = express.Router();

router.post('/createPost', createPost);

router.get('/getPost', getPostsFromFollowing);


module.exports = router;
