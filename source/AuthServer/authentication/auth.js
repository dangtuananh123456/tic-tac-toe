


const jwt = require("jsonwebtoken")
require("dotenv").config({path : "../../.env"});

const authenToken = (req, res, next) => {
      console.log("dfkjsfsjfsdfksdfjsdfdsfsdkj")
      console.log("token on header => ", req.headers.token)
      const tokenRefresh = req.headers.token;
      if (!tokenRefresh) {
            res.sendStatus(401);//chua dang nhap
            return;
      }; //authorize
    
      jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
            if (err){
                  res.sendStatus(403);//forbidden     
                  return;
            }
            else{
                  next();
            }
      });
}

module.exports = authenToken;