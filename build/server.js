"use strict";
exports.__esModule = true;
var http = require("http");
var config_1 = require("./config");
var socketio = require("socket.io");
var fs = require("fs");
var url = require("url");
var html = fs.readFileSync("./index.html");
var css = fs.readFileSync("../css/bootstrap.min.css");
var js = fs.readFileSync("../js/bootstrap.min.js");
var client_js = fs.readFileSync("./bundle.js");
var server = http.createServer(function (req, res) {
    var urlParts = url.parse(req.url);
    // console.log("urlParts = ", urlParts);
    switch (urlParts.pathname) {
        case "/":
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            break;
        case "/css/bootstrap.min.css":
            res.writeHead(200, { "Content-Type": "text/css" });
            res.write(css);
            res.end();
            break;
        case "/js/bootstrap.min.js":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(js);
            res.end();
            break;
        case "/bundle.js":
            res.writeHead(200, { "Content-Type": "text/javascript" });
            res.write(client_js);
            res.end();
            break;
        default:
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end("No pages...");
            break;
    }
});
var io = new socketio.Server(server);
io.on("connection", function (socket) {
    var socket_id = socket.id;
    console.log("[connect] socketId: ".concat(socket_id));
    // socket.to(roomId).emit("server_to_client", {
    //     message: {
    //         socket_id,
    //         clientId,
    //         roomId,
    //         counter: counter++,
    //     },
    // });
    // let clientId = "";
    var room_id = "";
    // clientからメッセージを受信
    socket.on("connected_client", function (data) {
        room_id = data.room_id;
        var user_name = data.user_name;
        console.log("[connected_client!]" + "room_id:".concat(room_id, ", user_name:").concat(user_name));
        socket.join(room_id);
        // clientにメッセージを送信
        // socket.to(room_id).emit("join_client", {client_id: socket_id, room_id: room_id, user_name: user_name });
        socket.emit("join_client", { socket_id: socket_id, room_id: room_id, user_name: user_name });
    });
    // socket.on("join_to_room", (data: { clientId: string; roomId: string }) => {
    //     roomId = data.roomId;
    //     clientId = data.clientId;
    //     socket.join(roomId);
    //     console.log(
    //         `[join to room] clientId: ${clientId} roomId: ${roomId}`,
    //     );
    // });
    socket.on('chat', function (msg) {
        console.log("chat: ".concat(msg));
        io.emit('chat', msg);
    });
});
server.listen(config_1.PORT, function () {
    console.log("Access to http://localhost:".concat(config_1.PORT));
});
