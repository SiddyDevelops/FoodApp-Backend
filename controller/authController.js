// const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const { sendMail } = require('../util/nodemailer');

const JWT_KEY = require('../secrets').JWT_KEY;

// SignUp User
module.exports.signup = async function signup(req,res,next) {
    try {
        let dataObj = req.body;
        let user = await userModel.create(dataObj);
        sendMail("signup",user);
        if(user) {
            return res.json({
                message: "User Signed Up!",
                data: user
            });
        } else {
            res.json({
                message: "Error Signing Up!"
            }); 
        }
    }catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// User Login
module.exports.login = async function login(req,res) {
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

// Authorization to check the user's role ['ADMIN','USER','RESTRAUNTOWNER','DELIVERYBOY']
module.exports.isAuthorised = function isAuthorised(roles) {
    return async function(req,res,next) {
        if(req.cookies.login) {
            token = req.cookies.login
            let payload = jwt.verify(token,JWT_KEY);
            const user = await userModel.findById(payload.payload);
            if(roles.includes(user.role) == true) {
                next();
            } else {
                res.status(401).json({
                    message: 'Operation not allowed.' 
                });
            }
        } else {
            res.json({
                message: 'Please login.'
            })
        }
    }
}

// Protect Route
module.exports.protectRoute = async function protectRoute(req,res,next) {
    try {
        let token;
        if(req.cookies.login) {
            token = req.cookies.login
            let payload = jwt.verify(token,JWT_KEY);
            if(payload) {
                console.log('payload token-> ',payload);
                const user = await userModel.findById(payload.payload);
                req.role = user.role;
                req.id = user.id;
                console.log(req.role);
                console.log(req.id);
                next();
            } else {
                const client = req.get('User-Agent');
                if(client.includes("Chrome") == true) {
                    return res.redirect('/login');
                }
                res.json({
                    message: 'Please Login Again.'
                });
            }    
        } else {
            res.json({
                message: 'Please login.'
            })
        }
    } catch(err) {
        return res.json({
            message: err.message
        });
    }
} 

// Forget Password
module.exports.forgetPassword = async function forgetPassword(req,res) {
    let {email} = req.body;
    try{
        const user = await userModel.findOne({email: email});
        if(user) {
            const resetToken = user.createResetToken();
            let host = req.get('host');
            let resetPasswordLink = `${req.protocol}://${host}/resetpassword/${resetToken}`;
            let obj = {
                resetPasswordLink: resetPasswordLink,
                email: email
            }
            sendMail("resetpassword",obj);
            return res.json({
                message: 'Reset Password Link sent to your email.'
            }); 
        } else {
            return res.json({
                message: 'Please signup'
            });
        }
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

// Reset Password
module.exports.resetpassword = async function resetpassword(req,res) {
    try{
        const token = req.params.token;
        let {password, confirmPassword} = req.body;
        const user = await userModel.findOne({resetToken: token});
        if(user) {
            user.resetPasswordHandler(password,confirmPassword);
            await user.save();
            res.json({
                message: 'User password updated successfully. Please login.'
            });
        } else {
            res.json({
                message: 'User not found!'
            });
        }        
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

module.exports.logout = function logout(req,res) {
    res.cookie('login',' ',{maxAge:1});
    res.json({
        message: 'User logged out successfully!'
    });
}