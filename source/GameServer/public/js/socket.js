
var socket = io("http://localhost:21408");

//chat all user online

$("#logoutHeader").click(async () => {
    let res = await fetch("/logout");
    let data = await res.json();
    if (data.status === 401) {
        alert("Bạn chưa đăng nhập");
    }
    else {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("typetable");
        localStorage.removeItem("username");
        localStorage.removeItem("order");
        location.href = "/";
    }
})

//handle display chatting box for each user with you
let buttonSendMessageCurrent;
let strRenderListUser = "";
let strRenderChatWindow = "";
if (localStorage.getItem("username") !== null) {
    socket.emit("CLIENT_LOGIN", localStorage.getItem("username"));
    socket.emit("CLIENT_REQUIRE_GET_LIST_ACTIVE_USER", localStorage.getItem("username"));
}

let currItemChatWindow;
socket.on("SERVER_SEND_LIST_ACTIVE_USER", data => {
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            strRenderListUser += `<div class = "currentUser itemListUserInChatBox">${data[i]}</div>`
            strRenderChatWindow += `
            <div class = "itemChatWindow displayChatWindow">
                <div class ="historyMessage">
                        <div style = "text-align:center; background-color : red; ">Đang nhắn tin với : <b>${data[i]}</b></div>
                </div>
                <input class ="messageChatting" placeholder="enter message here" type="text">
                <div class = "d-flex flex-wrap iconInChatHomaPage">
                    <img src="/images/icon1.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon2.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon3.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon4.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon5.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon6.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon7.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon8.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon9.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    <img src="/images/icon10.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                </div>
                <button type="button" class="btn btn-warning btnSendMessage">Send</button>
            </div>
        `
        }
        else {
            strRenderListUser += `<div class = "itemListUserInChatBox">${data[i]}</div>`
            strRenderChatWindow += `
                <div class = "displayNoneChatWindow itemChatWindow">
                    <div class ="historyMessage">
                            <div style = "text-align:center; background-color : red; ; ">Đang nhắn tin với : <b>${data[i]}</b></div>
                    </div>
                    <input class ="messageChatting" placeholder="enter message here" type="text">
                    <div class = "d-flex flex-wrap iconInChatHomaPage">
                        <img src="/images/icon1.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon2.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon3.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon4.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon5.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon6.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon7.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon8.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon9.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                        <img src="/images/icon10.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                    </div>
                    <button type="button"  class="btn btn-warning btnSendMessage">Send</button>
                </div>
            `
        }
    }

    $("#listUserInChatBox").html(strRenderListUser);
    $("#chatWindow").html(strRenderChatWindow);
    let listIcon = $(".iconInChatHomaPage");
    for (let i = 0; i < listIcon.length; i++) {
        let item1 = listIcon.eq(i).children();
        for (let j = 0; j < item1.length; j++) {
            let item = item1.eq(j);
            item.click(() => {
                if (item.hasClass("opacityClass")) {
                    item.removeClass("opacityClass");
                }
                else {
                    item.addClass("opacityClass")
                }
            })
        }
    }
    const ListUserInChatBox = $(".itemListUserInChatBox");
    const ParentListUserInChatBox = $("#listUserInChatBox");
    if (ListUserInChatBox.length !== 0) {
        socket.emit("CLIENT_JOIN_ROOM", { user1: localStorage.getItem("username"), user2: ParentListUserInChatBox.children().first().text().trim() });
    }

    const ListChatWindow = $(".itemChatWindow");
    currItemChatWindow = ListChatWindow.first();
    for (let i = 0; i < ListUserInChatBox.length; i++) {
        const item = ListUserInChatBox.eq(i);
        const itemChatWindow = ListChatWindow.eq(i);
        const usernameContact = item.text().trim();
        item.click(() => {
            currItemChatWindow = itemChatWindow;
            $(".itemChatWindow").filter(".displayChatWindow").removeClass("displayChatWindow").addClass("displayNoneChatWindow");
            $(".itemListUserInChatBox").filter(".currentUser").removeClass("currentUser");
            item.addClass("currentUser");
            itemChatWindow.removeClass("displayNoneChatWindow").addClass("displayChatWindow");
            socket.emit("CLIENT_JOIN_ROOM", { user1: localStorage.getItem("username"), user2: usernameContact });
        })
    }
    const btnSendMessage = $(".btnSendMessage");
    for (let i = 0; i < btnSendMessage.length; i++) {
        const item = btnSendMessage.eq(i);
        item.click(() => {
            const contentMessage = item.prev().prev().val().trim();
            item.prev().prev().val("");
            if (contentMessage.length !== 0) {
                buttonSendMessageCurrent = item;
                socket.emit("CLIENT_SEND_MESSAGE", { contentMessage: contentMessage, userSend: localStorage.getItem("username") });
            }

            //solve send icon
            let listIcon = item.prev().children();
            for (let i = 0; i < listIcon.length; i++) {
                const item1 = listIcon.eq(i);
                if (item1.hasClass("opacityClass")) {
                    buttonSendMessageCurrent = item;
                    item1.removeClass("opacityClass");
                    socket.emit("CLIENT_SEND_ICON_IN_CHAT_HOME_PAGE", {
                        usersend: localStorage.getItem("username"),
                        src: item1.attr("src")
                    })
                }
            }
        })
    }
})

socket.on("SERVER_SEND_ICON_CHAT_HOME_PAGE", data => {
    if (data.usersend === localStorage.getItem("username")) {
        const siblingWindowChat = buttonSendMessageCurrent.prev().prev().prev();
        console.log("siblingWindowChat => ", siblingWindowChat)
        console.log("data => ", data)
        siblingWindowChat.append(`<div style = "text-align : end"><img src = ${data.src} alt = "image" style = "height: 30px; width : 30px; margin-left:2px"></div>`)
    }
    else {
        const listActiveUser = $(".itemListUserInChatBox");
        const ListChatWindow = $(".itemChatWindow")
        for (let i = 0; i < listActiveUser.length; i++) {
            const itemUser = listActiveUser.eq(i);
            const itemChat = ListChatWindow.eq(i);
            if (itemUser.text().trim() === data.usersend) {
                itemChat.children().first().append(`<div ><img src = ${data.src} alt = "image" style = "height: 30px; width : 30px; margin-left:2px"></div>`)
                break;
            }
        }
    }
})

socket.on("SERVER_SEND_HISTORY_MESSAGE", data => {
    const historyChatBox = currItemChatWindow.children().first();
    if (historyChatBox.children().length === 1) {
        for (let i = 0; i < data.length; i++) {
            let saveSplit = data[i].split(" => ");
            if (saveSplit[0] === localStorage.getItem("username")) {
                if (saveSplit[1].includes("/images/icon")) {
                    historyChatBox.append(`<div style = "text-align : end"><img src = ${saveSplit[1]} alt = "image" style = "height: 30px; width : 30px; margin-left:2px"></div>`)
                }
                else historyChatBox.append(`<div class = "text-bg-light decorLineChat" style = "text-align:end">${saveSplit[1]}</div>`)
            }
            else {
                if (saveSplit[1].includes("/images/icon")) {
                    historyChatBox.append(`<div><img src = ${saveSplit[1]} alt = "image" style = "height: 30px; width : 30px; margin-left:2px"></div>`)
                }
                else historyChatBox.append(`<div class = "text-bg-dark decorLineChat">${saveSplit[1]}</div>`)
            }
        }
    }
})

socket.on("SERVER_SEND_MESSAGE", (data) => {
    if (data.userSend === localStorage.getItem("username")) {
        const siblingWindowChat = buttonSendMessageCurrent.prev().prev().prev();
        console.log("siblingWindowChat => ", siblingWindowChat)
        console.log("data => ", data)
        siblingWindowChat.append(`<div class = "text-bg-light decorLineChat" style = "text-align : end">${data.contentMessage.split(" => ")[1]}</div>`)
    }
    else {
        const listActiveUser = $(".itemListUserInChatBox");
        const ListChatWindow = $(".itemChatWindow")
        for (let i = 0; i < listActiveUser.length; i++) {
            const itemUser = listActiveUser.eq(i);
            const itemChat = ListChatWindow.eq(i);
            if (itemUser.text().trim() === data.userSend) {
                itemChat.children().first().append(`<div class = "text-bg-dark decorLineChat">${data.contentMessage.split(" => ")[1]}</div>`)
                break;
            }
        }
    }
});

socket.on("SERVER_SEND_ACTIVE_USER_MINUS", (data) => {
    const ListUserInChatBox = $(".itemListUserInChatBox");
    const ListChatWindow = $(".itemChatWindow")
    for (let i = 0; i < ListUserInChatBox.length; i++) {
        const itemUser = ListUserInChatBox.eq(i);
        const itemChat = ListChatWindow.eq(i);
        if (itemUser.text().trim() === data) {
            itemUser.remove();
            itemChat.remove();
            break;
        }
    }
})

socket.on("SERVER_SEND_ACTIVE_USER_ADD", data => {
    const ListUserInChatBox = $("#listUserInChatBox");
    const ListChatWindow = $("#chatWindow")
    ListUserInChatBox.append(`<div class = "itemListUserInChatBox">${data}</div>`)
    ListChatWindow.append(`
        <div class = "displayNoneChatWindow itemChatWindow">
            <div class ="historyMessage">
                <div style = "text-align:center; background-color : red; ">Đang nhắn tin với : <b>${data}</b></div>
            </div>
            <input class ="messageChatting" placeholder="enter message here" type="text">
            <div class = "d-flex flex-wrap iconInChatHomaPage">
                <img src="/images/icon1.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon2.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon3.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon4.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon5.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon6.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon7.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon8.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon9.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
                <img src="/images/icon10.png" alt="image" style = "height: 30px; width : 30px; margin-left:2px">
            </div>
            <button type="button" class="btn btn-warning btnSendMessage">Send</button>
        </div>
    `)
    const currUser = ListUserInChatBox.children().last();
    const currChatWindow = ListChatWindow.children().last();
    currItemChatWindow = ListChatWindow.children().first();

    let listIcon = currChatWindow.children().eq(2);
    let item1 = listIcon.children();
    for (let j = 0; j < item1.length; j++) {
        let item = item1.eq(j);
        item.click(() => {
            if (item.hasClass("opacityClass")) {
                item.removeClass("opacityClass");
            }
            else {
                item.addClass("opacityClass")
            }
        })
    }

    if (ListUserInChatBox.children().length == 1) {
        socket.emit("CLIENT_JOIN_ROOM", {
            user1: localStorage.getItem("username"),
            user2: ListUserInChatBox.children().first().text().trim()
        });
        currUser.addClass("currentUser");
        currChatWindow.removeClass("displayNoneChatWindow").addClass("displayChatWindow");
    }

    currUser.click(() => {
        $(".itemChatWindow").filter(".displayChatWindow").removeClass("displayChatWindow").addClass("displayNoneChatWindow");
        $(".itemListUserInChatBox").filter(".currentUser").removeClass("currentUser");
        currUser.addClass("currentUser");
        currChatWindow.removeClass("displayNoneChatWindow").addClass("displayChatWindow");
        const usernameContact = currUser.text().trim();
        currItemChatWindow = currChatWindow;
        socket.emit("CLIENT_JOIN_ROOM", { user1: localStorage.getItem("username"), user2: usernameContact });
    })
    const btnSendMessage = currChatWindow.children().last();
    btnSendMessage.click(() => {
        const inputMessage = currChatWindow.children().eq(1);
        const contentMessage = inputMessage.val().trim();
        inputMessage.val("");
        if (contentMessage.length !== 0) {
            buttonSendMessageCurrent = btnSendMessage;
            socket.emit("CLIENT_SEND_MESSAGE", { contentMessage: contentMessage, userSend: localStorage.getItem("username") });
        }

        //solve send icon
        const parentIcon = btnSendMessage.prev();
        let listIcon = parentIcon.children();
        for (let i = 0; i < listIcon.length; i++) {
            const item = listIcon.eq(i);
            if (item.hasClass("opacityClass")) {
                buttonSendMessageCurrent = btnSendMessage;
                item.removeClass("opacityClass");
                socket.emit("CLIENT_SEND_ICON_IN_CHAT_HOME_PAGE", {
                    usersend: localStorage.getItem("username"),
                    src: item.attr("src")
                })
            }
        }
    })
})


let errorLogin = "";
const handleSubmitLogin = async () => {
    errorLogin = "";
    const username = $("#usernameLogin").val();
    const password = $("#passwordLogin").val();
    const expiredtime = $("#expiredtime").val();
    const informLogin = {
        username: username,
        password: password,
        expiredtime: expiredtime
    }
    try {
        let response = await fetch("https://localhost:3003/login", {
            method: "POST",
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify(informLogin),
        })
        try {
            const data = await response.json();
            if (data.status === 401) {
                errorLogin = data.message;
            }

            if (errorLogin.length === 0) {
                const res = await fetch("/set-cookie-token", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json; charset=UTF-8",
                    },
                    body: JSON.stringify({
                        tokenRefresh: data.tokenRefresh
                    }),
                })
                //return homepage
                const dataRes = await res.json();
                //window.location = "http://localhost:21408";
                $("#loginHeader").html("Hello " + dataRes.username + "!")
                socket.emit("CLIENT_LOGIN", dataRes.username);
                localStorage.setItem("username", dataRes.username);
                location.href = "/"
            }
            else {
                $("#errorLogin").html(errorLogin);
                errorLogin = "";
            }
        } catch (e) {
            console.log(e);
        }
    }
    catch (e) {
        console.log(e);
    }
}

$("#btnSubmitLogin").click(async () => {
    const res = await handleSubmitLogin();
})

//xu li phan cua so choi game

$("#btnSubmitCreatePlayTable").click(() => {
    let namePlayTable = $("#InputNamePlayTable").val().trim();
    let typechess = $("#typechess").val();
    let typetable = $("#typetable").val();
    let timelimit = $("#timelimit").val();
    let sizetable = $("#sizetable").val();
    if (namePlayTable.length === 0) {
        $("#errorToCreatePlayTable").html("vui long nhap ten bang");
    }
    else {
        socket.emit("CLIENT_SEND_REQUIRED_CREATE_PLAY_TABLE", {
            usersend: localStorage.getItem("username"),
            nametable: namePlayTable,
            typetable: typetable,
            typechess: typechess,
            timelimit: timelimit,
            sizetable: sizetable
        })
    }
})

let NameTable = "";
socket.on("SERVER_SEND_STATUS_CREATE_PLAY_TABLE", data => {
    console.log(data);
    if (data.status === 404) {
        $("#errorToCreatePlayTable").html(data.message);
    }
    else {
        //lưu vai trò admin bảng tạo
        NameTable = data.nametable;
        localStorage.setItem(localStorage.getItem("username"), data.nametable);
        localStorage.setItem("nametable", data.nametable);
        localStorage.setItem("typetable", data.typetable)
        localStorage.setItem("typechess", data.typechess)
        localStorage.setItem("timelimit", data.timelimit)
        localStorage.setItem("sizetable", data.sizetable);
        location.href = `/join-your-play-table?type=${data.typetable}`
    }
})


socket.on("SERVER_SEND_LIST_NAME_PLAY_TABLE_TIC_TAC_TOE", data => {
    console.log(data);
    let strRender = "";
    for (let i = 0; i < data.length; i++) {
        strRender += `
            <div class="card joinOnlineTableTictactoe" style="width: 8rem; margin-right: 3px;" id = ${data[i]}>
                <img src="/images/bg.png" class="card-img-top" alt="image">
                <div class="card-body">
                    <p class="card-text">${data[i]}</p>
                </div>
            </div>
        `
    }
    $(".detailPlayTable").first().html(strRender);
    let joinOnlineTableTictactoe = $(".joinOnlineTableTictactoe");
    for (let i = 0; i < joinOnlineTableTictactoe.length; i++) {
        const item = joinOnlineTableTictactoe.eq(i);
        const id = item.attr("id");
        item.click(() => {
            socket.emit("CLIENT_JOIN_ONLINE_TABLE", {
                nametable: id,
                username: localStorage.getItem("username")
            })
        })
    }
})




let currUserJointable = "";
socket.on("SERVER_SEND_ADMIN_TABLE_TO_ACCEPT_USER", data => {
    const { nametable, userjoin } = data;
    currUserJointable = userjoin;
    if (localStorage.getItem(localStorage.getItem("username")) === nametable) {
        $("#notificationUserJoinTable").css("display", "block");
        $("#notificationContent").html(`${userjoin} Muốn tham gia`)
    }
})

$("#acceptUserJoinTable").click(() => {
    socket.emit("CLIENT_ADMIN_SEND_AGREE_TO_USER_JOIN", {
        nametable: localStorage.getItem(localStorage.getItem("username")),
        userjoin: currUserJointable
    })
    $("#notificationUserJoinTable").css("display", "none");
})

$("#denyUserJoinTable").click(() => {
    socket.emit("CLIENT_ADMIN_SEND_DENY_TO_USER_JOIN", {
        nametable: localStorage.getItem(localStorage.getItem("username")),
        userjoin: currUserJointable
    })
    $("#notificationUserJoinTable").css("display", "none");
})

socket.on("SERVER_RES_JOIN_ONLINE_TABLE", async (data) => {
    const { status, userjoin, nametable, type } = data;
    console.log(data);
    if (localStorage.getItem("username") === userjoin) {
        if (status === "404") {
            alert("Admin từ chối bạn tham gia");
        }
        else {
            //thanh cong
            const res = await fetch(`/join-your-play-table?type=${type}`)
            if (res.status === 401) {
                alert("Bạn chưa đăng nhập")
            }
            else if (res.status == 403) {
                socket.emit("CLIENT_LOGOUT", {
                    username: localStorage.getItem("username"),
                    nametable: localStorage.getItem(localStorage.getItem("username"))
                })
                alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại")
                localStorage.removeItem(localStorage.getItem("username"));
                localStorage.removeItem("username");
                location.href = "/";
            }
            else {
                socket.emit("CLIENT_JOIN_SUCCESS_ONLINE_TABLE_TO_PLAY_GAME", {
                    username: localStorage.getItem("username"),
                    nametable: nametable
                })
                location.href = `/join-your-play-table?type=${type}`
            }
        }
    }
})


socket.on("SERVER_SEND_TYPE_OF_TABLE", async (data) => {
    let res = await fetch(`/join-your-play-table?type=${localStorage.getItem("typetable")}`);
    console.log(res);
    if (res.status === 401) {
        alert("Bạn chưa đăng nhập")
    }
    else if (res.status === 403) {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("username");
        location.href = "/"
    }
    else {
        localStorage.setItem("nametable", data.nametable);
        localStorage.setItem("typetable", data.typetable);
        localStorage.setItem("typechess", data.typechess);
        localStorage.setItem("timelimit", data.timelimit)
        localStorage.setItem("sizetable", data.sizetable);
        location.href = `/join-your-play-table?type=${data.typetable}`
    }
})

socket.on("SERVER_SEND_LIST_USER_REQUIRE_PLAY", data => {
    console.log("SERVER_SEND_LIST_USER_REQUIRE_PLAY")
    console.log(data)
    const { nametable, listuser } = data;
    if (nametable === localStorage.getItem(localStorage.getItem("username"))) {
        $("#btnWatchHistoryStep").css("display", "none")
        let strRender = "";
        for (let i = 0; i < listuser.length; i++) {
            strRender += `
                <div class = "nameUserRequirePlayGame">${listuser[i]}</div>
            `
        }
        $("#listUserRequireToPlayGame").html(strRender);
        let listName = $(".nameUserRequirePlayGame");
        for (let i = 0; i < listName.length; i++) {
            let item = listName.eq(i);
            item.click(() => {
                if (item.hasClass("bgNameUserRequirePlayGame")) {
                    item.removeClass("bgNameUserRequirePlayGame");
                } else {
                    item.addClass("bgNameUserRequirePlayGame");
                }
            })
        }
    }
})


socket.on("SERVER_CANCEL_TABLE_BY_ADMIN_LOGOUT", nametable => {
    if (localStorage.getItem(localStorage.getItem("username")) !== nametable) {
        alert(nametable + " không tồn tại");
    }
    socket.emit("CLIENT_LEAVE_TABLE", nametable);
    location.href = "/";
})


const strCheckNotAllowPlay = "ban khong duoc duyet, chi duoc xem"
const strCheckAllowPlay = "Ban da duoc duyet, bat dau choi"
const strNotifyNotAllowToPlay = "ban khong khong duoc phep choi"
const strAwaitAdminAllowToPlay = "Doi admin chap nhan yeu cau cua ban"

$("#requireToPlayGame").click(() => {
    socket.emit("CLIENT_REQUIRE_PLAY_GAME", {
        username: localStorage.getItem("username")
    })
    $("#requireToPlayGame").css("display", "none");
    $("#btnWatchHistoryStep").css("display", "none");
    $("#NotificationStatusAllowPlay").html(strAwaitAdminAllowToPlay);
})

$("#joinTableToWatch").click(() => {
    socket.emit("CLIENT_JOIN_TABLE_TO_WATCH", {
        username: localStorage.getItem("username")
    })
    $("#displayWindowChatInGame").css("display", "block");
})

socket.on("SERVER_NOTIFY_THIS_TABLE_NOT_EXIST_BY_ADMIN_LOGOUT", () => {
    alert("Bảng game này đã bị hủy bỏ");
    location.href = "/";
})

socket.on("SERVER_SEND_STATUS_JOIN_TABLE_TO_WATCH", data => {
    const { username, nametable } = data;
    console.log(username);
    $("#joinTableToWatch").css("display", "none")
    $("#windowBoardGame").css("display", "block");
    if (nametable === localStorage.getItem(localStorage.getItem("username"))) {

    }
    else {
        $("#windowListUserRequireToPlayGame").css("display", "none");
        $("#requireToPlayGame").css("display", "block");
    }
})

$("#btnSubmitUserToPlayGame").click(() => {
    let listUser = $(".nameUserRequirePlayGame").filter(".bgNameUserRequirePlayGame");
    console.log("user duojc chonc => ", listUser);
    if (listUser.length !== 2) {
        alert("CHỉ được phép chọn đúng hai người chơi");
    }
    else {
        $("#btnWatchHistoryStep").css("display", "none");
        let item1 = listUser.eq(0);
        let item2 = listUser.eq(1);
        let username1 = item1.text();
        let username2 = item2.text();
        socket.emit("CLIENT_ADMIN_SEND_ALLOW_USER_PLAY", {
            username1: username1,
            username2: username2,
            tablename: localStorage.getItem(localStorage.getItem("username"))
        })
        socket.emit("CLIENT_REQUIRE_RESET_TABLE");
    }
})

socket.on("SERVER_SEND_USER_ALLOW_PLAY_GAME", data => {
    console.log(data);
    const { username1, username2, tablename } = data;
    if (username1 === localStorage.getItem("username") || username2 === localStorage.getItem("username")) {
        $("#NotificationStatusAllowPlay").html(strCheckAllowPlay);
        $("#requireToPlayGame").css("display", "none");
        $("#btnWatchHistoryStep").css("display", "none");
        $("#ManualReplayGame").css("display", "block");
        if (username1 === localStorage.getItem("username")) {
            alert("Bạn sẽ chơi trước")
            localStorage.setItem("order", "1");
        }
        else {
            alert("Bạn sẽ chơi sau");
            localStorage.setItem("order", "2");
        }
    }
    else if (tablename !== localStorage.getItem(localStorage.getItem("username"))) {
        $("#requireToPlayGame").css("display", "none");
        $("#btnWatchHistoryStep").css("display", "none");
        $("#NotificationStatusAllowPlay").html(strCheckNotAllowPlay);
        localStorage.removeItem("order");
    }
})

$("#ManualReplayGame").click(() => {
    socket.emit("CLIENT_REQUIRE_REPLAY_MANUAL_GAME")
})

socket.on("SERVER_SEND_SIGNAL_REPLAY_MANUAL_GAME", () => {
    resetBoard();
})


//=================== > hadle play game < ============================
let currentPlayer = 'X';
let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

function placeMarker(row, col) {
    const str = $("#NotificationStatusAllowPlay").text();
    if (str === strCheckNotAllowPlay) {
        alert(strCheckNotAllowPlay);
    }
    else if ($("#NotificationStatusAllowPlay").text() === strAwaitAdminAllowToPlay) {
        alert("Đợi admin chấp chận yêu cầu của bạn");
    }
    else if ($("#NotificationStatusAllowPlay").text() === "") {
        alert("Bạn không được phép chơi")
    }
    else if (localStorage.getItem("order") == null) {
        alert("Bạn không được phép chơi");
    }
    else if (localStorage.getItem("order") !== "1") {
        alert("Chưa đến lượt của bạn");
    }
    else {
        if (gameBoard[row][col] === '') {
            localStorage.setItem("order", "2"); //thay doi phien
            gameBoard[row][col] = currentPlayer;
            document.getElementById('tic-tac-toe').rows[row].cells[col].innerText = currentPlayer;
            let check = checkWin();
            console.log(check)
            if (check == 1) {
                socket.emit("CLIENT_SEND_STATUS_GAME", {
                    usernamesend: localStorage.getItem("username"),
                    status: "1",
                    row: row,
                    col: col,
                    currentplayer: currentPlayer
                })
            }
            else if (check == 0) {
                socket.emit("CLIENT_SEND_STATUS_GAME", {
                    usernamesend: localStorage.getItem("username"),
                    status: "0",
                    row: row,
                    col: col,
                    currentplayer: currentPlayer
                })
            }
            else {
                socket.emit("CLIENT_SEND_STATUS_GAME", {
                    usernamesend: localStorage.getItem("username"),
                    status: "-1",
                    row: row,
                    col: col,
                    currentplayer: currentPlayer
                })
            }
        }
    }
}

socket.on("SERVER_SEND_STATUS_GAME", data => {
    console.log("data => ", data);
    const { usernamesend, usernameget, status, row, col, currentplayer, nametable } = data;
    if (status === "1" || status === "0") {
        if (status === "1") {
            if (usernameget === localStorage.getItem("username")) {
                alert("Bạn đã thua");
            }
            else if (usernamesend === localStorage.getItem("username")) {
                alert("Bạn đã chiến thắng");
            }
            else {
                alert("Game da ket thuc")
            }
        }
        else if (status === "0") {
            let temp = localStorage.getItem("username");
            if (usernamesend === temp || usernameget === temp) {
                alert("Bạn đã hòa");
            }
            else {
                alert("Game da ket thuc")
            }
        }
        socket.emit("CLIENT_REQUIRE_RESET_TABLE");
        if (localStorage.getItem(localStorage.getItem("username")) !== nametable) {
            $("#requireToPlayGame").css("display", "block");
        }
        else {
            $("#listUserRequireToPlayGame").html("");
            socket.emit("CLIENT_ADMIN_REQUIRE_DELETE_ALL_USER_REQUIRE_PLAY")
        }
        $("#NotificationStatusAllowPlay").html("");
        $("#ManualReplayGame").css("display", "none");
        $("#btnWatchHistoryStep").css("display", "block")
    }
    else {
        if (usernameget === localStorage.getItem("username")) {
            localStorage.setItem("order", "1"); //đến phiên của bạn
        }
        gameBoard[row][col] = currentplayer;
        document.getElementById('tic-tac-toe').rows[row].cells[col].innerText = currentplayer;
        currentPlayer = currentplayer === 'X' ? 'O' : 'X';
    }
})

$("#btnWatchHistoryStep").click(() => {
    socket.emit("CLIENT_REQUIRE_GET_HISTORY_STEP_IN_TABLE");
})

socket.on("SERVER_SEND_HISTORY_STEP_IN_TABLE", data => {
    console.log(data);
    if (data.length === 0) {
        alert("Chưa tồn tại lịch sử trò chơi")
    }
    else {
        resetBoard();
        for (let i = 0; i < data.length; i++) {
            const { usernamesend, usernameget, status, row, col, currentplayer, nametable } = data[i];
            setTimeout(function () {
                document.getElementById('tic-tac-toe').rows[row].cells[col].innerText = currentplayer;
                $("#notifyThisStepForUser").html("Bước đi của : " + usernamesend);
            }, (i + 1) * 2000);
        }
    }
})

socket.on("SERVER_REQUIRE_RESET_TABLE", () => {
    $("#notifyThisStepForUser").html("");
    resetBoard();
})

function checkWin() {
    const winPatterns = [
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];
    let check = -1
    for (let i = 0; i < winPatterns.length; i++) {
        let pattern = winPatterns[i];
        let [a, b, c] = pattern;
        if (
            gameBoard[a[0]][a[1]] !== '' &&
            gameBoard[a[0]][a[1]] === gameBoard[b[0]][b[1]] &&
            gameBoard[a[0]][a[1]] === gameBoard[c[0]][c[1]]
        ) {
            check = 1;
            break;
        }
    }

    if (check !== 1) {
        let isTie = true;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (gameBoard[row][col] === '') {
                    isTie = false;
                    break;
                }
            }
        }

        if (isTie) {
            check = 0;
        }
    }
    return check;
}

function resetBoard() {
    gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            document.getElementById('tic-tac-toe').rows[row].cells[col].innerText = '';
        }
    }
    currentPlayer = 'X';
}

let itemtictactoe = $(".itemtictactoe");
console.log(itemtictactoe);
let itemInItemTictactoe00 = itemtictactoe.eq(0);
itemInItemTictactoe00.click(() => {
    placeMarker(0, 0);
})
let itemInItemTictactoe01 = itemtictactoe.eq(1);
itemInItemTictactoe01.click(() => {
    placeMarker(0, 1)
})
let itemInItemTictactoe02 = itemtictactoe.eq(2);
itemInItemTictactoe02.click(() => {
    placeMarker(0, 2)
})
let itemInItemTictactoe10 = itemtictactoe.eq(3);
itemInItemTictactoe10.click(() => {
    placeMarker(1, 0)
})
let itemInItemTictactoe11 = itemtictactoe.eq(4);
itemInItemTictactoe11.click(() => {
    placeMarker(1, 1)
})
let itemInItemTictactoe12 = itemtictactoe.eq(5);
itemInItemTictactoe12.click(() => {
    placeMarker(1, 2)
})
let itemInItemTictactoe20 = itemtictactoe.eq(6);
itemInItemTictactoe20.click(() => {
    placeMarker(2, 0)
})
let itemInItemTictactoe21 = itemtictactoe.eq(7);
itemInItemTictactoe21.click(() => {
    placeMarker(2, 1)
})
let itemInItemTictactoe22 = itemtictactoe.eq(8);
itemInItemTictactoe22.click(() => {
    placeMarker(2, 2)
})

//handle chatting in game

let listIconInGame = $("#iconInGame").children();
for (let i = 0; i < listIconInGame.length; i++) {
    const item = listIconInGame.eq(i);
    item.click(() => {
        if (item.hasClass("opacityClass")) {
            item.removeClass("opacityClass")
        }
        else {
            item.addClass("opacityClass");
        }
    })
}

$("#sendMessageInGame").click(() => {
    let contentMess = $("#inputMessageInGame").val().trim();
    if (contentMess.length !== 0) {
        socket.emit("CLIENT_SEND_MESSAGE_IN_GAME", {
            usersend: localStorage.getItem("username"),
            message: contentMess
        });
        $("#inputMessageInGame").val("")
    }
    let listIcon = $("#iconInGame").children();
    for (let i = 0; i < listIcon.length; i++) {
        const item = listIcon.eq(i);
        if (item.hasClass("opacityClass")) {
            let src = item.attr("src");
            socket.emit("CLIENT_SEND_ICON_IN_GAME", {
                usersend: localStorage.getItem("username"),
                icon: src
            })
            item.removeClass("opacityClass");
        }
    }
})

socket.on("SERVER_SEND_MESSAGE_IN_GAME", data => {
    const { usersend, message } = data;
    if (usersend === localStorage.getItem("username")) {
        $("#contentChatInGame").append(`
            <div style = "text-align : end; margin-bottom : 1px; background-color : brown">
                ${usersend} => ${message}
            </div>
        `)
    }
    else {
        $("#contentChatInGame").append(`
            <div style = "margin-bottom: 1px">
                ${usersend} => ${message}   
            </div>
        `)
    }
})

socket.on("SERVER_SEND_ICON_IN_GAME", data => {
    const { usersend, icon } = data;
    if (usersend === localStorage.getItem("username")) {
        $("#contentChatInGame").append(`
            <div style = "text-align : end">
                <img src = ${icon} alt = "image" style = "height: 30px; width : 30px; margin-left:2px">
            </div>
        `)
    }
    else {
        $("#contentChatInGame").append(`
            <div>
                <img src = ${icon} alt = "image" style = "height: 30px; width : 30px; margin-left:2px">
            </div>
        `)
    }
})


//handle truong hợp token hết hạn

$("#profile").click(async () => {
    let res = await fetch(`/modify-profile?username=${localStorage.getItem("username")}`);

    if (res.status === 401) {
        alert("Bạn chưa đăng nhập")
    }

    else if (res.status == 403) {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại")
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("username");
        location.href = "/";
    }
    else {
        location.href = `/modify-profile?username=${localStorage.getItem("username")}`;
    }
})


$("#createPlayTable").click(async () => {
    let res = await fetch("/create-table");
    console.log(res);
    if (res.status === 401) {
        alert("Bạn chưa đăng nhập");
    }
    else if (res.status === 403) {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại")
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("username");
        location.href = "/"
    }
    else {
        location.href = "/create-table"
    }
})

$("#rating").click(() => {
    location.href = "/rating"
})

$("#yourTable").click(async () => {
    let res = await fetch(`/join-your-play-table?type=${localStorage.getItem("typetable")}`);
    console.log(res);
    if (res.status === 401) {
        alert("Bạn chưa đăng nhập")
    }
    else if (res.status === 403) {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("username");
        location.href = "/"
    }
    else {
        if (localStorage.getItem(localStorage.getItem("username")) === null) {
            alert("Bạn chưa tạo bàn game nào")
        }
        else location.href = `/join-your-play-table?type=${localStorage.getItem("typetable")}`
    }
})


//handle update User

$("#btnSubmitModifyProfile").click(async () => {
    const Username = localStorage.getItem("username");
    const Password = $("#Password").val().trim();
    const RepeatPw = $("#repeatPassword").val().trim();
    const FullName = $("#FullName").val().trim();
    const Address = $("#Address").val().trim();
    const Avatar = $("#Avatar").val();
    const object = {
        Username: Username,
        Password: Password,
        FullName: FullName,
        Address: Address,
        Avatar: Avatar
    }

    if (RepeatPw !== Password) {
        $("#errRepeatPass").html("Nhập lại mật khẩu không đúng");
    }
    else {
        let token = await fetch("/get-cookie-token");
        let rf = await token.json();
        console.log(rf);
        let res = await fetch("https://localhost:3003/update-user", {
            method: "POST", // or 'PUT'
            headers: {
                "Content-Type": "application/json",
                token: rf.tokenRefresh
            },
            body: JSON.stringify(object)
        })

        if (res.status === 401) {
            alert("Bạn chưa đăng nhập")
        }
        else if (res.status === 403) {
            socket.emit("CLIENT_LOGOUT", {
                username: localStorage.getItem("username"),
                nametable: localStorage.getItem(localStorage.getItem("username"))
            })
            alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại");
            localStorage.removeItem(localStorage.getItem("username"));
            localStorage.removeItem("username");
            location.href = "/"
        }
        else {
            let data = await res.json();
            if (data.status === 401) {
                $("#errorModify").html(data.message);
            }
            else {
                location.href = "/";
            }
        }
    }
})


//Hiển thị lịch sử tham gia chơi của User


function resetMyBoard(id) {
    gameBoard = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            document.getElementById(`tic-tac-toe${id}`).rows[row].cells[col].innerText = '';
        }
    }
}

$("#watchHistoryPlayGameForUserInProfile").click(async () => {
    let res = await fetch(`/get-history-play-for-user?username=${localStorage.getItem("username")}`)

    if (res.status === 401) {
        alert("Bạn chưa đăng nhập")
    }
    else if (res.status === 403) {
        socket.emit("CLIENT_LOGOUT", {
            username: localStorage.getItem("username"),
            nametable: localStorage.getItem(localStorage.getItem("username"))
        })
        alert("Trạng thái đăng nhập của bạn đã hết hạn, vui lòng đăng nhập lại");
        localStorage.removeItem(localStorage.getItem("username"));
        localStorage.removeItem("username");
        location.href = "/"
    }
    else{
        let data = await res.json();
        let listTable = Object.keys(data);
        contentHistoryJoinTableUser
        if(listTable.length === 0) {
            $("#contentHistoryJoinTableUser").html("<h5>Chưa từng tham gia</h5>")
        }
        else{
            for(let i = 0; i < listTable.length; i++) {
                $("#contentHistoryJoinTableUser").append(`
                    <div>
                        <h5><b>Table Name : </b> ${listTable[i]}</h5>
                        <table id="tic-tac-toe${listTable[i]}">
                            <tr>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                            </tr>
                            <tr>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                            </tr>
                            <tr>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                                <td class="itemtictactoe"></td>
                            </tr>
                        </table>
                        <div id="notifyThisStepForUser${listTable[i]}" style="color: royalblue;"></div>
                        <button type = "button" class = "btn btn-warning" id = "${listTable[i]}" class = "btnWatchHistoryGame">Xem quá trình chơi</button>
                    </div>
                `)
            }

            let listItemTable = $("#contentHistoryJoinTableUser").children();
            console.log("listbtn => ", listItemTable)
            for(let i = 0; i < listItemTable.length; i++) {
                console.log()
                let table = listItemTable.eq(i);
                let item = table.children().last();
                item.click(() => {
                    console.log("co di qua day");
                    let id = item.attr("id");
                    console.log("id => ", id)
                    let listStep = data[id];
                    console.log("list step => ", listStep)
                    resetMyBoard(id);
                    for (let i = 0; i < listStep.length; i++) {
                        const { usernamesend, usernameget, status, row, col, currentplayer, nametable } = listStep[i];
                        setTimeout(function () {
                            document.getElementById(`tic-tac-toe${id}`).rows[row].cells[col].innerText = currentplayer;
                            let str = "Bước đi của : " + usernamesend;
                            if(usernamesend === localStorage.getItem("username")){
                                str = "Bước đi của bạn";
                            }
                            $(`#notifyThisStepForUser${id}`).html(str);
                        }, (i + 1) * 2000);
                    }
                })
            }
        }
    }
}) 
