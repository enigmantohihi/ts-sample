import { io } from "socket.io-client";
import {PORT} from "./config";

const socket = io(`http://localhost:${PORT}`);

const clientId = process.argv[2];
const roomId = process.argv[3];
console.log(`clientId: ${clientId} roomId: ${roomId}`);

socket.on("connect", () => {
    console.log('connect!!')
});

// serverからメッセージを受信
socket.on("server_to_client", (data: { message: object }) => {
    console.log(JSON.stringify(data.message));
});

// serverにメッセージを送信
socket.emit("join_to_room", { clientId, roomId });