const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const User = require("../models").User;
const db = require("../models").sequelize;

CheckAuth = (user_type=["user"]) => {
    
    return async (req, res, next) => {
        try{
            const StoragePath = path.join(__dirname + "/../storage");
            
            let cert = fs.readFileSync(StoragePath + "/public.key");
            let token = req.header("Authorization");
            let decoded = jwt.verify(token, cert, { algorithms: ['RS256'] });

            try {
                let user = await db.query("SELECT * FROM users WHERE status='1' AND id = (SELECT user_id FROM user_devices WHERE auth_token = ?) LIMIT 1",{ raw: true, replacements: [token]});
            
                if (user[0][0]) {
                    delete user[0][0].password;
                    req.user = user[0][0];
                                        
                    if (!user_type.includes(req.user.user_type)) {
                        return res.status(403).json({ message: "You don't have a permission to access this Route."});
                    }
                    return next();
                }
                return res.status(401).json({ message: "Unauthorized" });
            } catch(err){
                return res.status(500).json({ message: "Internal Server Error" });
            }
        }catch(e){
            res.status(401).send({message:"Unauthorized"});
        }
    };
}

module.exports = CheckAuth;


