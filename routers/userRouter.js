const express = require('express');
const userRouter = express.Router();
const multer = require('multer');
// const protectRoute = require('./authHelper');
// const {getUser, postUser, updateUser, deleteUser, getUserById, getCookies, setCookies} = require('../controller/userController');
const {getUser,updateUser,deleteUser,getAllUsers, updateProfile} = require('../controller/userController');
const {signup,login,isAuthorised,protectRoute,forgetPassword,resetpassword,logout} = require('../controller/authController');

// userRouter
// .route('/')
// .get(protectRoute,getUser)
// .post(postUser)
// .patch(updateUser)
// .delete(deleteUser);

// userRouter
// .route('/getCookies')
// .get(getCookies);

// userRouter
// .route('/setCookies')
// .get(setCookies);

// User Options
userRouter
.route('/:id')
.patch(updateUser)
.delete(deleteUser);

userRouter
.route('/signup')
.post(signup);

userRouter
.route('/login')
.post(login);

userRouter
.route('/forgetPassword')
.post(forgetPassword);

userRouter
.route('/resetpassword/:token')
.post(resetpassword);

userRouter
.route('/logout')
.get(logout);

// Multer for file upload
const multerStorage = multer.diskStorage({
    destination: function(req,file,cb) {
        cb(null,'public/images');
    },
    filename: function(req,file,cb) {
        cb(null,`user-${Date.now()}.jpeg`);
    }
});

const filter = function(req,file,cb){
    if(file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'),false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
});

userRouter.post('/profileImage',upload.single('photo'),updateProfile);
userRouter.get('/profileImage',function(req,res){
    res.sendFile('C:/Backend/FoodApp/public/multer.html');
});

// Profile Page
// userRouter.use('/userProfile',protectRoute)
userRouter
.route('/userProfile')
.get(protectRoute,getUser);

// Admin Specific Function
//userRouter.use(isAuthorised(['ADMIN']));
userRouter
.route('')
.get(isAuthorised(['ADMIN']),getAllUsers);

module.exports = userRouter;

