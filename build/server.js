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
    // console.log("urlParts= ", urlParts);
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
    var socketId = socket.id;
    console.log("[connect] socketId: ".concat(socketId));
    var clientId = "";
    var roomId = "";
    var counter = 0;
    // clientからメッセージを受信
    socket.on("join_to_room", function (data) {
        roomId = data.roomId;
        clientId = data.clientId;
        socket.join(roomId);
        console.log("[join to room] socketId: ".concat(socketId, " clientId: ").concat(clientId, " roomId: ").concat(roomId));
    });
    socket.on('chat', function (msg) {
        console.log("chat: ".concat(msg));
        io.emit('chat', msg);
    });
    // clientにメッセージを送信
    socket.to(roomId).emit("server_to_client", {
        message: {
            socketId: socketId,
            clientId: clientId,
            roomId: roomId,
            counter: counter++
        }
    });
});
server.listen(config_1.PORT, function () {
    console.log("Access to http://localhost:".concat(config_1.PORT));
});
