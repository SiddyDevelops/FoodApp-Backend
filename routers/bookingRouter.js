const express = require('express');
const { createSession } = require('../controller/bookingController');
const { protectRoute } = require('../controller/authController');
const bookingRouter = express.Router();

bookingRouter.post('/createSession',protectRoute,createSession);
bookingRouter.get('/createSession',function(req,res){
    res.sendFile('C:/Backend/FoodApp/public/booking.html');
});

module.exports = bookingRouter;