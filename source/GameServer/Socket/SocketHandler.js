
const listRoomInSocket = new Map();
const listActiveUser = new Map();
let listNameFile = [];
const listTypeTable = new Map();
const path = __dirname;
const itemPath = path.split("\\");
const needItem = itemPath.map((item, index) => {
    if (index !== itemPath.length - 1) {
        return item;
    }
})

const fs = require("fs");
const pathPointFile = "../datajson/Point.json"
const pathHistoryStepForTableFile = "../datajson/HistoryStepForTable.json";
const pathHistotyJoinTableForUser = "../datajson/HistoryJoinTableForUser.json"

const listPlayTableTicTacToe = new Map();
const listUserRequirePlayGame = new Map();
const listRoomCurr = new Map();
const listUserAllowPlayInTable = new Map();
let listHistoryStepForTable = [];
const listStatusTable = new Map();

const pathSolve = needItem.join("/");

let i = 0;
const SocketHandler = (io) => {

    io.on("connection", (socket) => {
        console.log("Have user connecting : ", socket.id);

        socket.on("CLIENT_REQUIRE_GET_LIST_ACTIVE_USER", data => {
            listActiveUser.set(data, true)
            const keyInlistUser = [...listActiveUser.keys()];
            socket.emit("SERVER_SEND_LIST_ACTIVE_USER", keyInlistUser);
        })

        socket.on("CLIENT_LOGOUT", (data) => {
            console.log("=======CLIENT_LOGOUT========")
            console.log("name => ", data);
            const { username, nametable } = data;
            listActiveUser.delete(username);
            const keyInlistUser = [...listActiveUser.keys()];
            listTypeTable.delete(nametable);
            listPlayTableTicTacToe.delete(nametable);
            io.sockets.emit("SERVER_SEND_ACTIVE_USER_MINUS", username);
            var listTable = [...listPlayTableTicTacToe.keys()]
            io.sockets.emit("SERVER_SEND_LIST_NAME_PLAY_TABLE_TIC_TAC_TOE", listTable);
            io.sockets.in(nametable).emit("SERVER_CANCEL_TABLE_BY_ADMIN_LOGOUT", nametable);
            socket.leave(nametable);
        })

        socket.on("CLIENT_JOIN_ROOM", (data) => {
            let preRoom1 = data.user1 + "_" + data.user2;
            let preRoom2 = data.user2 + "_" + data.user1;
            if (listRoomInSocket.has(preRoom1)) {
                socket.join(preRoom1);
                socket.ROOM_CURRENT = preRoom1;
                socket.emit("SERVER_SEND_HISTORY_MESSAGE", listRoomInSocket.get(preRoom1));
            }
            else if (listRoomInSocket.has(preRoom2)) {
                socket.join(preRoom2);
                socket.ROOM_CURRENT = preRoom2;
                socket.emit("SERVER_SEND_HISTORY_MESSAGE", listRoomInSocket.get(preRoom2));
            } else {
                socket.join(preRoom1);
                socket.ROOM_CURRENT = preRoom1;
                listRoomInSocket.set(preRoom1, []);
                socket.emit("SERVER_SEND_HISTORY_MESSAGE", listRoomInSocket.get(preRoom1));
            }
        })

        socket.on("CLIENT_SEND_MESSAGE", (data) => {
            let tem = listRoomInSocket.get(socket.ROOM_CURRENT);
            if (tem === undefined) {
                listRoomInSocket.set(socket.ROOM_CURRENT, [data.userSend + " => " + data.contentMessage])
            }
            else {
                tem.push(data.userSend + " => " + data.contentMessage);
                listRoomInSocket.set(socket.ROOM_CURRENT, tem);
            }
            data.contentMessage = data.userSend + " => " + data.contentMessage;
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_MESSAGE", data);
        })

        socket.on("CLIENT_LOGIN", data => {
            if (!listActiveUser.has(data)) {
                listActiveUser.set(data, true);
                io.sockets.emit("SERVER_SEND_ACTIVE_USER_ADD", data);
                var listTable = [...listPlayTableTicTacToe.keys()]
                io.sockets.emit("SERVER_SEND_LIST_NAME_PLAY_TABLE_TIC_TAC_TOE", listTable);
            }
        })

        let userSend = "";
        socket.on("CLIENT_SEND_CURRENT_USER", data => {
            userSend = data;
        })

        socket.on("CLIENT_SEND_FILE", (data) => {
            const splitted = data.split(';base64,');
            const renderPath = `/img_socket/${i}.png`;
            const pathfile = pathSolve + "/public" + renderPath;
            fs.writeFileSync(pathfile, splitted[1],
                {
                    encoding: 'base64'
                });
            const dataFile = {
                userSend: userSend,
                pathFile: renderPath
            }
            var temp = listRoomInSocket.get(socket.ROOM_CURRENT);
            temp.push(userSend + " =>:: " + renderPath);
            listRoomInSocket.set(socket.ROOM_CURRENT, temp);
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_FILE", dataFile);
            i++;
        });


        socket.on("CLIENT_SEND_REQUIRED_CREATE_PLAY_TABLE", data => {
            console.log("=========CLIENT_SEND_REQUIRED_CREATE_PLAY_TABLE==========")
            console.log(data);
            const { usersend, nametable, typetable } = data;
            const listNameTable = [...listPlayTableTicTacToe.keys()];
            let check = true;
            let check1 = true;
            for (let i = 0; i < listNameTable.length; i++) {
                var admin = listPlayTableTicTacToe.get(listNameTable[i])[0];
                if (admin === usersend) {
                    check1 = false;
                    break;
                }

                if (listNameTable[i] === nametable) {
                    check = false;
                    break;
                }
            }
            if (!check1) {
                socket.emit("SERVER_SEND_STATUS_CREATE_PLAY_TABLE", {
                    status: 404,
                    message: "Bạn chỉ được tạo bảng 1 lần khi đăng nhập"
                });
            }
            else if (!check) {
                socket.emit("SERVER_SEND_STATUS_CREATE_PLAY_TABLE", {
                    status: 404,
                    message: "Tên bảng này đã tồn tại vui lòng nhập tên khác"
                });
            }
            else {
                listPlayTableTicTacToe.set(nametable, [usersend]);
                listStatusTable.set(data.nametable, data);
                socket.ROOM_CURRENT = nametable;
                socket.join(nametable);
                listRoomCurr.set(usersend, nametable);
                listTypeTable.set(nametable, typetable);
                listUserRequirePlayGame.set(nametable, []);
                data.status = 200;
                socket.emit("SERVER_SEND_STATUS_CREATE_PLAY_TABLE", data);

                var listTable = [...listPlayTableTicTacToe.keys()]
                io.sockets.emit("SERVER_SEND_LIST_NAME_PLAY_TABLE_TIC_TAC_TOE", listTable);
                socket.emit("SERVER_SEND_LIST_USER_REQUIRE_PLAY", {
                    nametable: nametable,
                    listuser: []
                })
            }
        })

        socket.on("CLIENT_JOIN_ONLINE_TABLE", data => {
            console.log("=====CLIENT_JOIN_ONLINE_TABLE=====");
            console.log("data => ", data);
            const { nametable, username } = data;
            console.log(listPlayTableTicTacToe);
            let temp = listPlayTableTicTacToe.get(nametable);
            if (temp[0] !== username) {
                temp.push(username);
                listPlayTableTicTacToe.set(nametable, temp);
            }
            socket.join(nametable);
            listRoomCurr.set(username, nametable);
            socket.ROOM_CURRENT = nametable;
            console.log("socket.ROOM_CURRENT => ", socket.ROOM_CURRENT);
            const type = listTypeTable.get(nametable)
            socket.emit("SERVER_SEND_TYPE_OF_TABLE", listStatusTable.get(nametable));
        })


        socket.on("CLIENT_ADMIN_JOIN_OWN_TABLE", data => {
            const { nametable, username } = data;
            socket.ROOM_CURRENT = nametable;
            socket.join(nametable);
            listRoomCurr.set(username, nametable);
            let listuser = [];
            if (!listUserRequirePlayGame.get(nametable)) {
                listUserRequirePlayGame.set(nametable, []);
            }
            else {
                listuser = listUserRequirePlayGame.get(nametable);
            }
            socket.emit("SERVER_SEND_LIST_USER_REQUIRE_PLAY", {
                nametable: nametable,
                listuser: listuser
            });
        })

        var listTable = [...listPlayTableTicTacToe.keys()]
        io.sockets.emit("SERVER_SEND_LIST_NAME_PLAY_TABLE_TIC_TAC_TOE", listTable);

        socket.on("CLIENT_LEAVE_TABLE", nametable => {
            try {
                socket.leave(nametable);
            }
            catch (e) {
                console.log(e)
            }
        })


        socket.on("CLIENT_REQUIRE_PLAY_GAME", data => {
            console.log("=====CLIENT_REQUIRE_PLAY_GAME=======")
            console.log(socket.rooms);
            console.log(data);
            console.log(listUserRequirePlayGame);
            console.log("socket curr room", socket.ROOM_CURRENT);
            const { username } = data;
            let listuser = listUserRequirePlayGame.get(socket.ROOM_CURRENT);
            let check = true;
            for (let i = 0; i < listuser.length; i++) {
                const item = listuser[i];
                if (item === username) {
                    check = false;
                    break;
                }
            }
            if (check === true) {
                listuser.push(username);
                listUserRequirePlayGame.set(socket.ROOM_CURRENT, listuser);
                console.log("list user => ", listuser);
                io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_LIST_USER_REQUIRE_PLAY", {
                    nametable: socket.ROOM_CURRENT,
                    listuser: listuser
                })
            }
        })

        socket.on("CLIENT_JOIN_TABLE_TO_WATCH", data => {
            console.log("=======CLIENT_JOIN_TABLE_TO_WATCH==========")
            const { username } = data;
            let currTable = listRoomCurr.get(username);
            if (!listPlayTableTicTacToe.has(currTable)) {
                socket.emit("SERVER_NOTIFY_THIS_TABLE_NOT_EXIST_BY_ADMIN_LOGOUT")
            }
            else {
                socket.join(currTable);
                socket.ROOM_CURRENT = currTable;
                socket.emit("SERVER_SEND_STATUS_JOIN_TABLE_TO_WATCH", {
                    username: username,
                    nametable: currTable
                })
                let listuser = listUserRequirePlayGame.get(socket.ROOM_CURRENT);
                console.log("listuser => ", listuser);
                io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_LIST_USER_REQUIRE_PLAY", {
                    nametable: socket.ROOM_CURRENT,
                    listuser: listuser
                })
            }
        })

        socket.on("CLIENT_ADMIN_SEND_ALLOW_USER_PLAY", data => {
            console.log("========CLIENT_ADMIN_SEND_ALLOW_USER_PLAY========");
            console.log(data);
            let { username1, username2, tablename } = data;
            listUserAllowPlayInTable.set(tablename, [username1, username2]);
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_USER_ALLOW_PLAY_GAME", {
                username1: username1,
                username2: username2,
                tablename: tablename
            })
        })

        socket.on("CLIENT_SEND_STATUS_GAME", data => {
            console.log("========CLIENT_SEND_STATUS_GAME=========")
            console.log(data);
            var item = listUserAllowPlayInTable.get(socket.ROOM_CURRENT);
            let user1 = item[0];
            let user2 = item[1];
            data.nametable = socket.ROOM_CURRENT;
            if (data.usernamesend === user1) {
                //
                data.usernameget = user2
            }
            else {
                //
                data.usernameget = user1;
            }
            //xứ lí lưu lịch sử các bước của bàn cờ, lịch sử tham gia cua user name
            listHistoryStepForTable.push(data);
            if (data.status === "1") {
                //xử lí tính điểm
                let dataJson = JSON.parse(fs.readFileSync(pathPointFile));
                if (dataJson.hasOwnProperty(data.usernamesend)) {
                    dataJson[data.usernamesend] = parseInt(dataJson[data.usernamesend]) + 10;
                    fs.writeFileSync(pathPointFile, JSON.stringify(dataJson));
                }
                else {
                    dataJson[data.usernamesend] = 10;
                    fs.writeFileSync(pathPointFile, JSON.stringify(dataJson));
                }
            }

            if (data.status === "1" || data.status === "0") {
                //ghi lịch sử step của ban game
                let dataJson = JSON.parse(fs.readFileSync(pathHistoryStepForTableFile));
                dataJson[socket.ROOM_CURRENT] = listHistoryStepForTable;
                fs.writeFileSync(pathHistoryStepForTableFile, JSON.stringify(dataJson));
                //ghi lịch sử tham gia của user
                let dataInHJTFU = JSON.parse(fs.readFileSync(pathHistotyJoinTableForUser));
                if(!dataInHJTFU.hasOwnProperty(user1)){
                    dataInHJTFU[user1] = {};
                }
                if(!dataInHJTFU.hasOwnProperty(user2)) {
                    dataInHJTFU[user2] = {};
                }
                dataInHJTFU[user1][socket.ROOM_CURRENT] = listHistoryStepForTable;
                dataInHJTFU[user2][socket.ROOM_CURRENT] = listHistoryStepForTable;
                fs.writeFileSync(pathHistotyJoinTableForUser, JSON.stringify(dataInHJTFU));
                listHistoryStepForTable = [];
            }

            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_STATUS_GAME", data);
        })

        socket.on("CLIENT_REQUIRE_RESET_TABLE", () => {
            console.log("========CLIENT_REQUIRE_RESET_TABLE========")
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_REQUIRE_RESET_TABLE")
            listHistoryStepForTable = [];
        })

        socket.on("CLIENT_ADMIN_REQUIRE_DELETE_ALL_USER_REQUIRE_PLAY", () => {
            listUserRequirePlayGame.set(socket.ROOM_CURRENT, []);
        })

        socket.on("CLIENT_REQUIRE_REPLAY_MANUAL_GAME", () => {
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_SIGNAL_REPLAY_MANUAL_GAME")
            listHistoryStepForTable = [];
        })

        socket.on("CLIENT_REQUIRE_GET_HISTORY_STEP_IN_TABLE", () => {
            let data = JSON.parse(fs.readFileSync(pathHistoryStepForTableFile));
            let target = [];
            if(data.hasOwnProperty(socket.ROOM_CURRENT)){
                target = data[socket.ROOM_CURRENT];
            }
            socket.emit("SERVER_SEND_HISTORY_STEP_IN_TABLE", target);
        })

        socket.on("CLIENT_SEND_MESSAGE_IN_GAME", data => {
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_MESSAGE_IN_GAME", data)
        })

        socket.on("CLIENT_SEND_ICON_IN_GAME", data => {
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_ICON_IN_GAME", data);
        })

        socket.on("CLIENT_SEND_ICON_IN_CHAT_HOME_PAGE", data => {
            console.log("===========CLIENT_SEND_ICON_IN_CHAT_HOME_PAGE========")
            console.log(data)
            if(!listRoomInSocket.has(socket.ROOM_CURRENT)){
                listRoomInSocket.set(socket.ROOM_CURRENT, []);
            }
            let temp = listRoomInSocket.get(socket.ROOM_CURRENT);
            temp.push(data.usersend + " => " + data.src);
            listRoomInSocket.set(socket.ROOM_CURRENT, temp);
            io.sockets.in(socket.ROOM_CURRENT).emit("SERVER_SEND_ICON_CHAT_HOME_PAGE", data)
        })
    });
}

module.exports = SocketHandler;