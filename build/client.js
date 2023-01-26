"use strict";
exports.__esModule = true;
var socket_io_client_1 = require("socket.io-client");
var config_1 = require("./config");
var socket = (0, socket_io_client_1.io)("http://localhost:".concat(config_1.PORT));
var clientId = process.argv[2];
var roomId = process.argv[3];
console.log("clientId: ".concat(clientId, " roomId: ").concat(roomId));
socket.on("connect", function () {
    console.log('connect!!');
});
// serverからメッセージを受信
socket.on("server_to_client", function (data) {
    console.log(JSON.stringify(data.message));
});
// serverにメッセージを送信
socket.emit("join_to_room", { clientId: clientId, roomId: roomId });
