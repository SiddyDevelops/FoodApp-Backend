const nodemailer = require("nodemailer");
const APP_PASS_KEY = require('../secrets').APP_PASS_KEY;

module.exports.sendMail = async function sendMail(str,data) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          type: 'login',
          user: 'siddhartsingh2002@gmail.com',
          pass: 'srjd fbrb rltu hqks'
        }
    });

    var Osubject,Otext, Ohtml;
    if(str == "signup") {
        Osubject = `Thank you for signing ${data.name}`;
        Ohtml =
            `<h1>Welcome to foodApp.com</h1>
            Hope you have a good time !
            Here are your details
            Name - ${data.name}
            Email - ${data.email}` 
    }
    else if(str == "resetpassword"){
        Osubject = `Reset Password`;
        Ohtml =
            `<h1> foodAp.com</h1>
            Here is your link to reset your password !
            ${data.resetPasswordLink}`
    }

    const info = await transporter.sendMail({
        from: '"FoodApp" <siddhartsingh2002@gmail.com>', // sender address
        to: data.email, // list of receivers
        subject: Osubject, // Subject line
        // plain text body
        html: Ohtml, // html body
    });
    console.log('Message sent: %s', info.messageId);
}
