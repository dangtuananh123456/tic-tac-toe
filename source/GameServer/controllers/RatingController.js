

const fs = require("fs")
const path = "../datajson/Point.json"
module.exports = class RatingController {

    static cmp = (obj1, obj2) => {
        if(obj1.point  < obj2.point){
            return 1;
        }
        else if(obj1.point > obj2.point){
            return -1;
        }
        return 0
    }

    static handleRating = (req, res) => {
        let data = JSON.parse(fs.readFileSync(path));
        let listKey = Object.keys(data);
        let list = [];
        for(let i = 0; i < listKey.length; i++) {
            list.push({
                username : listKey[i],
                point : data[listKey[i]]
            })
        }
        list = list.sort(RatingController.cmp);
        res.json(list);
    }
}