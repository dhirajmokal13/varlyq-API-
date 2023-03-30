const express = require('express');
const router = express.Router();
const controller = require('./controller');

//User Routes
router.get('/users', controller.user.userLogin); //For Login The user
router.post('/users', controller.user.userCreate); // For Creating User
router.put('/users/:id', controller.user.userUpdate); //identify using the id and remaining data will be send in body using json
router.delete('/users/:id', controller.user.userDelete); //Idetify id and remove the user

//Post Routes
router.get('/posts', controller.post.viewPost); //should be only available for logged-in users after verifying the token from header
router.post('/posts', controller.post.createPost); // for creating the posts
router.put('/posts/:id', controller.post.updatePost); //update the posts using the id and remaining data in the body
router.delete('/posts/:id', controller.post.deletePost); // remove the posts using id
module.exports = router;