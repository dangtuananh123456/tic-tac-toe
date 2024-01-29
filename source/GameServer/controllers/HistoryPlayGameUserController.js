const UserModel = require("../Models/UserModel")

module.exports = class HistoryJoinTableForUser{
    static HandleHistoryPlayGameUser = (req, res) => {
        let username = req.query.username;
        console.log(username)
        let data = UserModel.getHistoryPlayGameUser(username);
        console.log(data)
        return res.json(data);
    }
}
