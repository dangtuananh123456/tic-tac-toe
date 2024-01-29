

const nameTable = "Users";
const fs = require("fs")
const path = "../datajson/User.json"
const pathHistotyJoinTableForUser = "../datajson/HistoryJoinTableForUser.json"

module.exports = class UserModel {


    static getHistoryPlayGameUser = (username) => {
        let data = JSON.parse(fs.readFileSync(pathHistotyJoinTableForUser));
        if(!data.hasOwnProperty(username)){
            return {};
        }
        return data[username];
    }

    static getAllUser = () => {
        let AllUser = JSON.parse(fs.readFileSync(path));
        return AllUser; 
    }

    static getUserByUserName = (username) => {
        let AllUser = JSON.parse(fs.readFileSync(path));
        const data = [];
        for (let i = 0; i < AllUser.length; i++) {
            const item = AllUser[i];
            if (item.Username === username) {
                data.push(item);
                break; 
            }
        }  
        return data;
    }

    static addUser = (object) => {
        let AllUser = JSON.parse(fs.readFileSync(path));
        AllUser.push(object);
        fs.writeFileSync(path, JSON.stringify(AllUser));
    }

}