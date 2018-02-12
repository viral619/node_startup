const config = require('config');
const path = require('path');
const fs = require('fs');

const ejs = require('ejs');


console.log(config.get('base_path'));


let template = fs.readFileSync(config.get('base_path') + 'views/emails/forgot_password.html', {
    encoding: 'utf-8'
});

//console.log(template);

let  ACTIVELINK = config.get('base_url') + 'password-reset/' + token 

var emailBody = ejs.render(template, {
    sUsername: user.name || (user.first_name+" "+ user.last_name),
    SITE_NAME: config.get('app_name'),
    ACTIVELINK: ACTIVELINK,
    CURRENT_YEAR: new Date.getFullYear()
});



/* require("dotenv").config();
const nodemailer = require('nodemailer');

// Create a SMTP transporter object
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, 
    auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD
    }
});

// Message object
let message = {
    from: process.env.SMTP_FROM,
    to: 'viral.b@yudiz.in',
    subject: 'Nodemailer is unicode friendly ✔',
    text: 'Hello to myself!',
    html: '<p><b>Hello</b> to myself!</p>'
};

transporter.sendMail(message, (err, info) => {
    if (err) {
        console.log('Error occurred. ' + err.message);
        return process.exit(1);
    }
    console.log('Message sent: %s', info.messageId);
});
 */