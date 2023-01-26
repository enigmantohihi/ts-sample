import { io } from "socket.io-client";
import {PORT} from "./config";

window.addEventListener("load",load);

function load() {
    const connect_btn: any = document.getElementById('connect_btn');
    connect_btn.onclick = function() {
        // connect();
        console.log("click");
    };
}

let socket: any;
let client_id: string;
let room_id: number;

function connect(){
    socket = io(`http://localhost:${PORT}`);
    client_id = String("A");
    room_id = Number(1);
    console.log(`clientId: ${client_id} roomId: ${room_id}`);

}

function send_message(){
    if (socket == null) return;
    // serverにメッセージを送信
    socket.emit("join_to_room", { client_id, room_id });
}

function disconnect(){
    if (socket == null) return;
    if (socket.connected) {
        socket.disconnect();
    }   
}

if (socket != null) {
    socket.on("connect", () => {
        console.log('connect!!');
    });
    
    // serverからメッセージを受信
    socket.on("server_to_client", (data: { message: object }) => {
        console.log(JSON.stringify(data.message));
    });
    
    socket.on("disconnect", () => {
        console.log("disconnect!");
    });
}
