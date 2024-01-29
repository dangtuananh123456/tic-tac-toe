
const UserController = require("../controllers/userController.js");
const HistoryJoinTableForUser = require("../controllers/HistoryPlayGameUserController.js");
const RatingController = require("../controllers/RatingController.js");
const auth = require("../../AuthServer/authentication/auth.js")
const jwt = require("jsonwebtoken")
const setHeaderToken = require("../SetHeaderToken/SetHeaderToken.js")
const route = (app) => {

    app.get("/get-history-play-for-user",setHeaderToken, auth, HistoryJoinTableForUser.HandleHistoryPlayGameUser)

    app.post("/rating", RatingController.handleRating)

    app.get("/rating", (req, res) => {
        res.render("Rating");
    })

    app.get("/join-your-play-table", setHeaderToken, auth , (req, res) => {
        if(req.query.type === "1") {
            res.render("PlayTable1");
        }
        else{
            res.render("PlayTable2");
        }
    })

    app.get("/create-table", setHeaderToken, auth, (req, res) => {
        res.render("CreatePlayTable")
    })

    app.get("/modify-profile",setHeaderToken, auth, UserController.handleGetModifyUser)

    app.get("/logout", UserController.handleLogout);

    app.get("/get-cookie-token", (req, res) => {
        const tokenRefresh = req.cookies.tokenRefresh;
        res.json({tokenRefresh : tokenRefresh});
    })

    app.post("/set-cookie-token" , (req, res) => {
        if(req.body.tokenRefresh) {
                res.cookie("tokenRefresh", req.body.tokenRefresh, {
                    secure: true,
                    httpOnly: true,
                    sameSite: 'lax'});
        }
        let username;
        const tokenRefresh = req.body.tokenRefresh;
        jwt.verify(tokenRefresh, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
                if (err){
                    res.json({status : 403}) //forbidden : access token expired
                    return;
                }
                username = data.username
        });
        res.json({
                status: 200,
                username : username
        })
    })

    app.get("/", (req, res) => {
        res.render("content");
    })
}

module.exports = route;