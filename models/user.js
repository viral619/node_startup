'use strict';
const nodemailer = require('nodemailer');

module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
        name: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
        user_type: DataTypes.ENUM('admin','merchant','user'),
        mobile:DataTypes.STRING,
        dob:DataTypes.DATE,
        gender:DataTypes.ENUM("male","female"),
        profile_pic:DataTypes.STRING,
        address:DataTypes.STRING,
        status:DataTypes.STRING,
        password_reset_token:DataTypes.STRING,
        created_at:DataTypes.DATE,
        updated_at:DataTypes.DATE

    },
    {
        classMethods: {
            associate: function(models) {
            
            }
        },
        timestamps: true,
        createdAt: "created_at",
        updatedAt: 'updated_at',
        underscored:true
    });

    User.prototype.toJSON = function (){
        var values = Object.assign({}, this.get());

        delete values.password;
        return values;
    };

    User.prototype.sendMail = async function (data) {
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
            from: data.from || process.env.SMTP_FROM,
            to: this.email,
            subject: data.subject,
            html: data.html
        };

        try{
            let result = await transporter.sendMail(message);
        
            if (result) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        } catch(e){
            console.log(`Error :: Sending Email in User Model ${e}`);
            return Promise.reject(e);
        }

    };

    return User;
};