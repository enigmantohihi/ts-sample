import * as http from "http";
import {PORT} from "./config";
import * as socketio from "socket.io";
import * as fs from "fs";
const url = require("url");

const html = fs.readFileSync("./index.html");
const css = fs.readFileSync("../css/bootstrap.min.css");
const js = fs.readFileSync("../js/bootstrap.min.js");
const client_js = fs.readFileSync("./bundle.js");

const server: http.Server = http.createServer(function(req,res){
    const urlParts = url.parse(req.url);
    // console.log("urlParts= ", urlParts);
    switch(urlParts.pathname){
        case "/":
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(html);
            break;
        case "/css/bootstrap.min.css":
            res.writeHead(200, {"Content-Type": "text/css"});
			res.write(css);
			res.end();
			break;
        case "/js/bootstrap.min.js":
            res.writeHead(200, {"Content-Type": "text/javascript"});
            res.write(js);
            res.end();
            break;
        case "/bundle.js":
            res.writeHead(200, {"Content-Type": "text/javascript"});
            res.write(client_js);
            res.end();
            break;
        default:
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end("No pages...");
            break;
    }
})

const io: socketio.Server = new socketio.Server(server);

io.on("connection", (socket: socketio.Socket) => {
    const socketId = socket.id;
    console.log(`[connect] socketId: ${socketId}`);

    let clientId = "";
    let roomId = "";
    let counter = 0;

    // clientからメッセージを受信
    socket.on("join_to_room", (data: { clientId: string; roomId: string }) => {
        roomId = data.roomId;
        clientId = data.clientId;
        socket.join(roomId);
        console.log(
            `[join to room] socketId: ${socketId} clientId: ${clientId} roomId: ${roomId}`,
        );
    });

    socket.on('chat', function(msg){
        console.log(`chat: ${msg}`);
        io.emit('chat', msg);
    });

    // clientにメッセージを送信
    socket.to(roomId).emit("server_to_client", {
        message: {
            socketId,
            clientId,
            roomId,
            counter: counter++,
        },
    });
});

server.listen(PORT, () => {
    console.log(`Access to http://localhost:${PORT}`);
});