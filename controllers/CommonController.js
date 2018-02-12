var randomstring = require("randomstring");
const config = require('config');
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const multer = require('multer');
const bcrypt = require("bcrypt");

const User = require("../models").User;

const saltRounds = 10;
let salt = bcrypt.genSaltSync(saltRounds);

let storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, 'public/images/')
	},
	filename: function(req, file, callback) {
		callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
	}
})


class CommonController {
    
    async forgot_password(req, res)
    {    
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Please Provide Valid Email").isEmail();
        
        try {
            
            let valid = await req.getValidationResult();
            if (!valid.isEmpty()) return res.status(400).json(valid.array());
        
            let user = await User.findOne({ where: { email: req.body.email} });

            if (!user) {
                return res.status(400).json({ message: `User not Found with this Email ID` });
            }

            if (user.status == 0) {
                return res.status(403).json({ message: "Acoount is Blocked by Admin" });
            }

            let token = randomstring.generate();

            let template = fs.readFileSync(config.get('base_path') + 'views/emails/forgot_password.html', {encoding: 'utf-8'});

            let subject = config.get('app_name') + " - Password Reset";

            let html = ejs.render(template, {
                SITE_NAME: config.get('app_name'),
                ACTIVELINK: config.get('base_url') + '/password-reset/' + token,
                CURRENT_YEAR: (new Date).getFullYear()
            });

            let sent = await user.sendMail({html,subject});
            let result = await User.update({password_reset_token:token}, { where: { id: user.id } });

            if (result && sent ) {
                return res.json({ message: `Password Reset Successfully, Check your Email` });
            }
            return res.status(500).json({ message: `internal server Error` });

        } catch (e) {
            console.log(`Error in Forgot Password :: ${e}`);
            return res.status(500).json({ message: `internal server Error` });
        }
    }

    async change_profile_picture(req, res)
    {        
        var upload = multer({
            storage: storage,
            fileFilter: function(req, file, callback) {
                var ext = path.extname(file.originalname)
                if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
                    return callback(res.status(400).json({message:'Only images are allowed'}), null);
                }
                callback(null, true)
            }
        }).single('image');

        upload(req, res, async function(err) {
            if (!err) {
                console.log(req.file);
                try{
                    let result = await User.update({profile_pic:req.file.filename}, { where: { id:req.user.id} });
                    if (result) 
                        return res.json({message:"Profile Picture Changed Successfully"});
                    
                    return res.status(500).json({message:"Internal Server Error"});

                }catch(e){
                    console.log(`Error in Change Profile Picture :: ${e}`);
                    return res.status(500).json({ message: `Internal Server Error` });
                }
            }
            console.log(`ERROR IN UPLOAD :: ${err}`);
            return res.status(500).json({ message: `Internal Server Error` });
        })
    }

    async reset_password_form(req,res)
    {
        let data = {
            TOKEN : req.params.token,
            SITE_NAME: config.get('app_name'),
            CURRENT_YEAR: (new Date()).getFullYear(),
            BASE_URL: config.get('base_url')
        };

        return res.render('passwords/reset_password.html',data);
    }

    async reset_password(req,res)
    {
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Please Provide Valid Email").isEmail();
        req.checkBody("password", "Password is required").notEmpty();
        req.checkBody("token", "Token is Required").notEmpty();

        try{
            let valid = await req.getValidationResult();
            if (!valid.isEmpty()) return res.render('shared/error.html',{message:"Required Fields are missing.",BASE_URL: config.get('base_url')});

            let user = await User.findOne({ where: { email: req.body.email, password_reset_token:req.body.token} });
            
            if (!user) {
                return res.render('shared/error.html',{message:"Email Does not Exists or Link is Expired <br/> please resend this email.",BASE_URL: config.get('base_url')});
            }

            if (user.status == 0) {
                return res.render('shared/error.html',{message:"Account Blocked By Admin.",BASE_URL: config.get('base_url')});
            }

            let password = bcrypt.hashSync(req.body.password, salt);
            let result = user.update({password: password,password_reset_token:null});

            if (result) {
                return res.render('shared/success.html',{message:"Password Changed Successfully.",BASE_URL: config.get('base_url')});
            }
            return res.render('shared/error.html',{message:"Internal Server Error.",BASE_URL: config.get('base_url')});
        
        }catch(e){
            console.log(`Error in Password Rest :: ${e}`);
            return res.render('shared/error.html',{ message: "Internal Server Error",BASE_URL: config.get('base_url') });
        }
    }
}

module.exports = new CommonController();