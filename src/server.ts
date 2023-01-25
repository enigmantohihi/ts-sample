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
    console.log("connect!")

    let counter = 0;

    // clientからメッセージを受信
    socket.on("yyy", (data: {message: string}) => {
        console.log(`type: ${typeof data} data: ${data.message}`);
    });

    // clientにメッセージを送信
    setInterval(() => {
        socket.emit("xxx", {message: `server message ${counter++}`});
    }, 1000);
});

server.listen(PORT, () => {
    console.log(`Access to http://localhost:${PORT}`);
});
