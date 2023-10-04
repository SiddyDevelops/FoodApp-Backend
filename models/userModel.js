const mongoose = require('mongoose');
const emailValidate = require('email-validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const DB_LINK = require('../secrets').DB_LINK;

mongoose.connect(DB_LINK)
.then(function(db){
    console.log('user database connected');
})
.catch(function(err){
    console.log(err);
});

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: function() {
            return emailValidate.validate(this.email);
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    confirmPassword: {
        type: String,
        //required: true,
        minLength: 8,
        validate: function() {
            return this.password == this.confirmPassword;
        }
    },
    role: {
        type: String,
        enum: ['ADMIN','USER','RESTRAUNTOWNER','DELIVERYBOY'],
        default: 'USER'
    },
    profileImage: {
        type: String,
        default: 'img/users/default.jpeg'
    },
    resetToken: String
});

// userSchema.post('save', function(doc){
//     console.log('after saving in DB ',doc);
// });


userSchema.pre('save', function(){
    this.confirmPassword = undefined;
});

// userSchema.pre('save', async function(){
//     let salt = await bcrypt.genSalt();     
//     let hashedString = await bcrypt.hash(this.password,salt);
//     this.password = hashedString;
// });

// (async function createUser() {
//     let user = {
//         name: 'Mitali',
//         email: 'mitali@gmail.com',
//         password: '987654321',
//         confirmPassword: '987654321'
//     };

//     let data = await userModel.create(user);
//     console.log(data);
// })();

userSchema.methods.createResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    return resetToken;
}

userSchema.methods.resetPasswordHandler = function(password,confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;