const merchant = require("express").Router();
const MerchantsController = require("../controllers/merchant/MerchantsController");
const UniqueEmailMiddleware = require("../middlewares/CheckUniqueEmail");
const AuthMiddleware = require("../middlewares/CheckAuth");

merchant.post("/registration", UniqueEmailMiddleware, MerchantsController.store);
merchant.post("/login", MerchantsController.login);

/**
 * Route Which Requires Authentication Starts Here
 */

merchant.use(AuthMiddleware(["merchant","admin"]));
merchant.get("/profile", MerchantsController.show);
merchant.put("/profile", MerchantsController.update);

/**
 * Authenticated Routes Ends Here 
 */

module.exports = merchant;
