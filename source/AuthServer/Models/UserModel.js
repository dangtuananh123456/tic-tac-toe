

const nameTable = "Users";
const fs = require("fs")
const path = "../datajson/User.json"


module.exports = class UserModel {

    static UpdateUser = (object) => {
        let AllUser = JSON.parse(fs.readFileSync(path));
        for(let i = 0; i < AllUser.length; i++) {
            const item = AllUser[i];
            if(item.Username === object.Username) {
                AllUser[i] = object;
                break;
            }
        }
        fs.writeFileSync(path, JSON.stringify(AllUser));
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

    static randomInt = (min, max, exclude) => {
        const nums = [];
        const excludeLookup = new Set(exclude);
        for (let i = min; i <= max; i++) {
            if (!excludeLookup.has(i)) nums.push(i);
        }
        if (nums.length === 0) return false;

        const randomIndex = Math.floor(Math.random() * nums.length);
        return nums[randomIndex];
    }

    static addUser = (object) => {
        let AllUser = JSON.parse(fs.readFileSync(path));
        AllUser.push(object);
        fs.writeFileSync(path, JSON.stringify(AllUser));
    }

}