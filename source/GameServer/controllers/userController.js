

const UserModel = require("../Models/UserModel.js")
const jwt = require("jsonwebtoken");


module.exports = class UserController {

    static handleGetModifyUser = ( req, res) => {
        console.log(req.query)
        const username = req.query.username;
        console.log("user name => ", username)
        let target = UserModel.getUserByUserName(username);
        console.log(target[0])
        return res.render("modifyProfile", target[0]);
    }

    static handleLogout = async (req, res) => {
        //delete token key on cookie
        res.clearCookie("tokenAccess");
        res.clearCookie("tokenRefresh");
        res.json({
            status: 200
        })
    }
}
 