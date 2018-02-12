const web = require('express').Router();
const CommonController = require("../controllers/CommonController");
const AuthMiddleware = require("../middlewares/CheckAuth");


web.get('/password-reset/:token',CommonController.reset_password_form);
web.post('/password-reset',CommonController.reset_password);

/**
 * Route Which Requires Authentication Starts Here
 */

//route.use(AuthMiddleware(["user","merchant","admin"]));

/**
 * Authenticated Routes Ends Here 
 */

module.exports = web;