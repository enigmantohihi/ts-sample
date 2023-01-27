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
    // console.log("urlParts = ", urlParts);
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
    const socket_id = socket.id;
    console.log(`[connect] socketId: ${socket_id}`);
    // socket.to(roomId).emit("server_to_client", {
    //     message: {
    //         socket_id,
    //         clientId,
    //         roomId,
    //         counter: counter++,
    //     },
    // });

    // let clientId = "";
    let room_id: string = "";

    // clientからメッセージを受信
    socket.on("connected_client", (data) => {
        room_id = data.room_id;
        let user_name = data.user_name;
        console.log("[connected_client!]" + `room_id:${room_id}, user_name:${user_name}`);
        socket.join(room_id);

        // clientにメッセージを送信
        // socket.to(room_id).emit("join_client", {client_id: socket_id, room_id: room_id, user_name: user_name });
        socket.emit("join_client", {socket_id, room_id, user_name });
    });
    
    // socket.on("join_to_room", (data: { clientId: string; roomId: string }) => {
    //     roomId = data.roomId;
    //     clientId = data.clientId;
    //     socket.join(roomId);
    //     console.log(
    //         `[join to room] clientId: ${clientId} roomId: ${roomId}`,
    //     );
    // });

    socket.on('chat', function(msg){
        console.log(`chat: ${msg}`);
        io.emit('chat', msg);
    });
});

server.listen(PORT, () => {
    console.log(`Access to http://localhost:${PORT}`);
});