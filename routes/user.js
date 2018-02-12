const user= require('express').Router();
const UsersController = require("../controllers/user/UsersController");
const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
const AuthMiddleware = require("../middlewares/CheckAuth");

user.post("/registration", UniqueEmailMiddleware, UsersController.store);
user.post("/login", UsersController.login);

/**
 * Route Which Requires Authentication Starts Here
 */

user.use(AuthMiddleware(["user","merchant","admin"]));
user.get("/profile", UsersController.show);
user.put("/profile", UsersController.update);



/**
 * Authenticated Routes Ends Here 
 */

module.exports = user;