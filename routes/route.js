const route= require('express').Router();

const CommonController = require("../controllers/CommonController");
const AuthMiddleware = require("../middlewares/CheckAuth");



route.post('/forgot-password',CommonController.forgot_password);

/**
 * Route Which Requires Authentication Starts Here
 */

route.use(AuthMiddleware(["user","merchant","admin"]));
route.put('/profile-picture',CommonController.change_profile_picture);

/**
 * Authenticated Routes Ends Here 
 */

module.exports = route;