import { io } from "socket.io-client";
import {PORT} from "./config";

const socket = io(`http://localhost:${PORT}`);

socket.on("connect", () => {
    console.log('connect!!')
});

// serverからメッセージを受信
socket.on("xxx", (data: {message: string}) => {
    console.log(`type: ${typeof data}   data: ${data.message}`);
});

// serverにメッセージを送信
let counter = 0;
setInterval(() => {
    socket.emit("yyy", {message: `client message ${counter++}`});
}, 1000);