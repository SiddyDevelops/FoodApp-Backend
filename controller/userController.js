const userModel = require('../models/userModel');

// module.exports.getUser = async function getUser(req,res) {
//     let allUsers = await userModel.find();
//     res.send({
//         message: 'list of all users',
//         data: allUsers
//     });
// };

module.exports.getUser = async function getUser(req,res) {
    let id = req.id;
    console.log('UserId ',id);
    let user = await userModel.findById(id);
    if(user) {
        return res.json(user);
    } else {
        return res.json({
            message: 'User not found!'
        });
    }
};

// module.exports.postUser = function postUser(req,res) {
//     //console.log(req.body);
//     users = req.body;
//     res.json({
//         message: "Data Received Successfully!",
//         user: req.body
//     });
// };

// module.exports.updateUser = async function updateUser(req,res) {
//     let user = await userModel.findOneAndUpdate({email: "ash@gmail.com"}, dataToBeUpdated);
//     // for(key in dataToBeUpdated) {
//     //     users[key] = dataToBeUpdated[key];
//     // }
//     res.json({
//         message: "Data Updated Successfully!",
//         data: user
//     });
// };

module.exports.updateUser = async function updateUser(req,res) {
    try {
        let id = req.params.id;
        let user = await userModel.findById(id);
        let dataToBeUpdated = req.body;
        if(user) {
            const keys = [];
            for(let key in dataToBeUpdated) {
                keys.push(key);
            }

            for(let i=0;i<keys.length;i++) {
                user[keys[i]] = dataToBeUpdated[keys[i]];
            }
            const updatedData = await user.save();
            res.json({
                message: "Data Updated Successfully!",
                data: user
            });
        } else {
            res.json({
                message: "User not found!"
            });
        }
    }catch(err) {
        console.log(err);
        res.json({
            message: err.message
        });
    }
};

// module.exports.deleteUser = async function deleteUser(req,res) {
//     let dataToBeDeleted = req.body;
//     let user = await userModel.findOneAndDelete(dataToBeDeleted);
//     res.json({
//         message: "Data Deleted Successfully!",
//         data: user
//     });
// };

module.exports.deleteUser = async function deleteUser(req,res) {
    try {
        let id = req.params.id;
        let user = await userModel.findByIdAndDelete(id);
        if(!user) {
            res.json({
                message: "User not found!"
            });
        }
        res.json({
            message: "Data Deleted Successfully!",
            data: user
        });
    }catch(err) {
        res.json({
            message: err.message
        });
    }
};

// module.exports.getUserById = function getUserById(req,res) {
//     console.log(req.params.username);
//     console.log(req.params);
//     res.send("User id received.");
// };

module.exports.getAllUsers = async function getAllUsers(req,res) {
    let users = await userModel.find();
    if(users) {
        res.json({
            message: 'Users retrieved',
            data: users
        });
    } else {
        res.json({
            message: 'No users found!'
        });
    }
};

// module.exports.getCookies = function getCookies(req,res) {
//     let cookie = req.cookies;
//     console.log(cookie);
//     res.send('cookies received ');
// }

// module.exports.setCookies = function setCookies(req,res) {
//     //res.setHeader('Set-Cookie', 'isLoggedIn=true');
//     res.cookie('isLoggedIn',true, {maxAge: 1000*60*60*24, secure: true, httpOnly: true});
//     res.cookie('isPrimeMember',true);
//     res.send('cookies has been set ');
// }

module.exports.updateProfile = async function updateProfile(req,res) {
    res.json({
        message: 'File uploaded successfully!'
    });
};