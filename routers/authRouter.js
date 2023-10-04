const express = require('express');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_KEY = require('../secrets').JWT_KEY;

authRouter
.route('/signup')
.get(middleware1,getSignUp,middleware2)
.post(postSignUp);

authRouter
.route('/login')
.post(loginUser);

function getSignUp(req,res,next) {
    //res.sendFile('public/index.html', {root: __dirname});
    console.log("GET signup called!");
    next();
};

async function postSignUp(req,res) {
    let dataObj = req.body;
    let user = await userModel.create(dataObj);
    //console.log('backend: ',user);
    res.json({
        message: "User signed up!",
        data: user
    });
}

function middleware1(req,res,next) {
    console.log('middle1 encountered');
    next();
}

function middleware2(req,res,next) {
    console.log('middle2 encountered');
    //next();
    console.log("middleware 2 ended req/res cycle");
    res.sendFile('public/index.html', {root: __dirname});
}

async function loginUser(req,res) {
    try{    
        let data = req.body;
        if(data.email) {
            let user = await userModel.findOne({email: data.email});
            if(user) {
                if(user.password == data.password) {
                    let uid = user['_id'];
                    let token = jwt.sign({payload:uid}, JWT_KEY);
                    res.cookie('login',token, {httpOnly: true});
                    return res.json({
                        message: 'User has LoggedIn.',
                        userDetails: data
                    }); 
                } else {
                    return res.json({
                        message: 'Invalid Credentials.'
                    });
                }
            } else {
                return res.json({
                    message: 'User not found! Please signup.'
                });
            }
        } else {
            return res.json({
                message: 'Please enter all the credentials.'
            });
        }
    } catch(err) {
        return res.status(500).json({
            message: err.message
        });
    }
}

module.exports = authRouter;