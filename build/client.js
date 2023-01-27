"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var config_1 = require("./config");
window.addEventListener("load", load);
function load() {
    var connect_btn = document.getElementById('connect_btn');
    connect_btn.textContent = "Connect";
    connect_btn.addEventListener("click", function () {
        console.log("connect click");
        connect();
    });
    var message_list = document.getElementById("message_list");
    return {
        message_list: message_list
    };
}
var socket;
var client_id;
var room_id;
var user_name;
function connect() {
    // console.log("online=", window.navigator.onLine);
    var roomid_text_box = document.getElementById("roomid_text_box");
    var username_text_box = document.getElementById("username_text_box");
    room_id = String(roomid_text_box.value);
    user_name = String(username_text_box.value);
    if (room_id == null || room_id == "" || room_id.match(/^[ 　\r\n\t]*$/)) {
        alert("部屋名を入力してください");
        return;
    }
    if (user_name == null || user_name == "" || user_name.match(/^[ 　\r\n\t]*$/)) {
        user_name = "名無し";
        username_text_box.value = user_name;
    }
    // serverに接続
    socket = (0, socket_io_client_1.io)("http://localhost:".concat(config_1.PORT));
    socket.on("connect", function () {
        console.log('connect!!');
        connected();
    });
    socket.on("join_client", function (data) {
        console.log("join_client");
        var li = document.createElement("li");
        li.className = "list-group-item mb-1";
        li.textContent = "".concat(data.user_name, " is join!");
        load().message_list.appendChild(li);
    });
    // socket.on("join_client", ($data: { message: object }) => {
    //     const data = JSON.stringify($data.message);
    //     console.log(data);
    //     const li: HTMLElement = <HTMLElement>document.createElement("li");
    //     li.className = "list-group-item mb-1";
    //     li.textContent = `${data}`;
    //     load().message_list.appendChild(li);
    // });
    // connected();
    // socket.on("connected", ($client_id: string)=> {
    //     client_id = $client_id;
    //     console.log(`clientId: ${client_id}, roomId: ${room_id}, user_name: ${user_name}`);
    // });
}
// 接続時に呼ばれる
function connected() {
    if (socket != null && socket.connected) {
        var connect_btn = document.getElementById('connect_btn');
        connect_btn.textContent = "Disconnect";
        connect_btn.className = "btn btn-danger";
        connect_btn.addEventListener("click", function () {
            console.log("disconnect click");
            disconnect();
        });
        console.log("send: ".concat(room_id, ", ").concat(user_name));
        socket.emit("connected_client", { room_id: room_id, user_name: user_name });
    }
}
function disconnect() {
    if (socket == null || !socket.connected)
        return;
    socket.disconnect();
    disconnected();
    socket.on("disconnect", function () {
        console.log('disconnect!!');
        disconnected();
    });
}
// 切断時に呼ばれる
function disconnected() {
    var connect_btn = document.getElementById('connect_btn');
    connect_btn.textContent = "Connect";
    connect_btn.className = "btn btn-primary";
    connect_btn.addEventListener("click", function () {
        console.log("connect click");
        connect();
    });
}
// if (socket != null) {
//     console.log("null でない");
//     socket.on("connect", () => {
//         console.log('connect!!');
//         connected();
//     });
//     // serverからメッセージを受信
//     socket.on("server_to_client", (data: { message: object }) => {
//         console.log(JSON.stringify(data.message));
//     });
//     socket.on("disconnect", () => {
//         console.log("disconnect!");
//     });
// } else {
//     console.log("is null");
// }
// if (socket!=null && socket.connected) {
//     socket.on("connect", () => {
//         console.log('connect!!');
//         connected();
//     });
// }
