const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { userAuth, refreshTokenAuth, Logout } = require('./middleware/auth');

//if users send request to root then send request to documentation
router.get('/', async (req, res) => {
    res.redirect('https://documenter.getpostman.com/view/25159036/2s93RUuXjj');
})

//User Routes
router.get('/users', controller.user.userLogin); //For Login The user
router.post('/users', controller.user.userCreate); // For Creating User
router.put('/users', userAuth, controller.user.userUpdate); //identify using the id and remaining data will be send in body using json
router.delete('/users', userAuth, controller.user.userDelete); //Idetify id and remove the user

//Post Routes
router.get('/posts', userAuth, controller.post.viewPost); //should be only available for logged-in users after verifying the token from header
router.post('/posts', userAuth, controller.post.createPost); // for creating the posts
router.put('/posts/:id', userAuth, controller.post.updatePost); //update the posts using the id and remaining data in the body
router.delete('/posts/:id', userAuth, controller.post.deletePost); // remove the posts using id

//auth
router.post('/token/refresh', refreshTokenAuth);
router.post('/users/logout', Logout);

module.exports = router;