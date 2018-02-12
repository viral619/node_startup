const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require('lodash');

const User = require("../../models").User;
const UserDevice = require("../../models").UserDevice;


const saltRounds = 10;
let salt = bcrypt.genSaltSync(saltRounds);
const StoragePath = path.join(__dirname + "/../../storage");


class Users {
    
    async store(req, res) {
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Please Provide Valid Email").isEmail();
        req.checkBody("password", "Password is required").notEmpty();
        req.checkBody("name", "Name is required").notEmpty();
        req.checkBody("mobile", "Mobile is required").notEmpty();
        req.checkBody("type", "Device Type is required").notEmpty();
        req.checkBody("type", "Device Type Must be in ios or android").isIn(["android", "ios"]);
        req.checkBody("push_token", "Device Type is required").notEmpty();

        try{
            let result = await req.getValidationResult();
            if (!result.isEmpty()) return res.status(400).json(result.array());

            let userObject = _.pick(req.body,['email','name','mobile']);
            userObject['password'] = bcrypt.hashSync(req.body.password, salt);

            let user = await User.create(userObject);

            let cert = fs.readFileSync(StoragePath + "/private.key");
            let auth_token = jwt.sign({ data: user }, cert, {expiresIn: "30d",algorithm: "RS256"});
            let user_device = await UserDevice.create({user_id: user.id,type: req.body.type,push_token: req.body.push_token,auth_token: auth_token});

            let response = {data: user,authorization: auth_token};

            return res.json(response);
        
        }catch(e){
            console.log(`Error in User Registration (Create) :: ${e}`);
            if (e["original"]["code"] == "ER_DUP_ENTRY") {
                return res.status(400).json({ message: "Email Already Exists." });
            }
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async login(req, res) {
        req.checkBody("email", "Email is required").notEmpty();
        req.checkBody("email", "Please Provide Valid Email").isEmail();
        req.checkBody("password", "Password is required").notEmpty();
        req.checkBody("type", "Device Type is required").notEmpty();
        req.checkBody("type", "Device Type Must be in ios or android").isIn(["android", "ios"]);
        req.checkBody("push_token", "Device Type is required").notEmpty();

        try {

            let result = await req.getValidationResult();
            if (!result.isEmpty()) return res.status(400).json(result.array());

            let user = await User.findOne({ where: { email: req.body.email, user_type:"user"} });
            if (!user) {
                return res.status(400).json({ message: "Wrong Email" });
            }
    
            if (!bcrypt.compareSync(req.body.password, user.password)) {
                return res.status(400).json({ message: "Wrong Password" });
            }

            if (user.status == 0) {
                return res.status(403).json({ message: "Acoount is Blocked by Admin" });
            }

            let cert = fs.readFileSync(StoragePath + "/private.key");
            let auth_token = jwt.sign({ data: user }, cert, {expiresIn: "30d",algorithm: "RS256"});

            let user_device = await UserDevice.update({type: req.body.type,push_token: req.body.push_token,auth_token: auth_token},{ where: { user_id: user.id } });
            let response = {data: user, authorization: auth_token};
            return res.json(response);
            
        }catch(e){
            console.log(`Error in User Login :: ${e}`);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    show(req, res) {
        return res.json({ data: req.user });
    }

    async update(req, res) {
        
        let data = _.pick(req.body,['name','dob','mobile','gender']);

        try {
            if (req.body.password) {
                data.password = bcrypt.hashSync(req.body.password, salt);
            }

            let result = await User.update(data, { where: { id: req.user.id } });
            if (result) {
                req.user.name = data.name;
                req.user.dob = data.dob;
                req.user.mobile = data.mobile;
                req.user.gender = data.gender;

                return res.json({ data: req.user });
            }
            return res.status(500).json({ message: `internal server Error ${result}` });
        } catch (e) {
            console.log(`Error in User Update :: ${e}`);
            return res.status(500).json({ message: `internal server Error` });
        }
    }
}

module.exports = new Users();