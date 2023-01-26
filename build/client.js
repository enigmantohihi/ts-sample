"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var config_1 = require("./config");
window.addEventListener("load", load);
function load() {
    var connect_btn = document.getElementById('connect_btn');
    connect_btn.onclick = function () {
        // connect();
        console.log("click");
    };
}
var socket;
var client_id;
var room_id;
function connect() {
    socket = (0, socket_io_client_1.io)("http://localhost:".concat(config_1.PORT));
    client_id = String("A");
    room_id = Number(1);
    console.log("clientId: ".concat(client_id, " roomId: ").concat(room_id));
}
function send_message() {
    if (socket == null)
        return;
    // serverにメッセージを送信
    socket.emit("join_to_room", { client_id: client_id, room_id: room_id });
}
function disconnect() {
    if (socket == null)
        return;
    if (socket.connected) {
        socket.disconnect();
    }
}
if (socket != null) {
    socket.on("connect", function () {
        console.log('connect!!');
    });
    // serverからメッセージを受信
    socket.on("server_to_client", function (data) {
        console.log(JSON.stringify(data.message));
    });
    socket.on("disconnect", function () {
        console.log("disconnect!");
    });
}
