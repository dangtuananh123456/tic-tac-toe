
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const UserModel = require("../Models/UserModel.js")
require("dotenv").config({path : "../../.env"});
const jwt = require("jsonwebtoken")


module.exports = class UserController {

    static handleUpdateUser = (req, res) => {
        let object = req.body;
        var target = UserModel.getUserByUserName(object.Username);
        if (target.length === 0) {
            res.json({
                status: 401,
                message : "Khong ton tai tai khoan"
            })
        }
        else {
            let item = target[0];
            if (object.Password.trim().length !== 0) {
                item.Password = bcrypt.hashSync(object.Password.trim(), salt);
            }
            if(object.Avatar.trim().length !== 0) {
                item.Avatar = object.Avatar.trim();
            }
            if(object.FullName.trim().length !== 0) {
                item.FullName = object.FullName.trim();
            }
            if(object.Address.trim().length !== 0) {
                item.Address = object.Address.trim();
            }
            UserModel.UpdateUser(item);
            res.json({status : 200})
        }
    }

    static handleRegister = async (req, res) => {
        const hash = bcrypt.hashSync(req.body.password, salt);
        const username = req.body.username;
        
        const userTarget = UserModel.getUserByUserName(username);
        if (userTarget.length !== 0) {
            res.json({
                status: 404,
                message: "username is already exist"
            })
            return;
        }

        let object = {
            Username: username,
            Password: hash,
            FullName: req.body.fullname,
            Address: req.body.address,
            Avatar: "fa fa-hand-grab-o",
        }

        UserModel.addUser(object);
        res.json({
            status: 200
        });
    }

    static handleLogin = (req, res) => {
        console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;
        const expiredtime = req.body.expiredtime
        const userTarget = UserModel.getUserByUserName(username);
        if (userTarget.length === 0) {
            res.json({
                status: 401,
                message: "not exist username"
            })
            return;
        }
        else {
            //exist user in db
            if (!bcrypt.compareSync(password, userTarget[0].Password)) {
                res.json({
                    status: 401,
                    message: "password not right"
                })
                return;
            }

            //sinh ra  token refresh
            const tokenRefresh = jwt.sign(
                { username: username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: expiredtime }
            )

            res.json({
                tokenRefresh: tokenRefresh
            })
        }
    }
}

