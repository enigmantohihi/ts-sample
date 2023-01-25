import * as http from "http";
import {PORT} from "./config";
import * as socketio from "socket.io";
import * as fs from "fs";

const html = fs.readFileSync("./index.html");
const server = http.createServer(
    (req, res) => {
        const url = req.url;
        console.log('url=', url)
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(html);
    }
);

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
