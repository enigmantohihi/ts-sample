import * as http from "http";
import {PORT} from "./config";
import * as socketio from "socket.io";

const server = http.createServer(
    (req, res) => {
        res.end("Hellooooooo!");
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

    // clientにメッセージを送信
    setInterval(() => {
        socket.to(roomId).emit("server_to_client", {
            message: {
                socketId,
                clientId,
                roomId,
                counter: counter++,
            },
        });
    }, 1000);
});

server.listen(PORT, () => {
    console.log(`Access to http://localhost:${PORT}`);
});
