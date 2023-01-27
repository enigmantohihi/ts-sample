import { io } from "socket.io-client";
import {PORT} from "./config";

window.addEventListener("load",load);

function load() {
    const connect_btn: HTMLInputElement = <HTMLInputElement>document.getElementById('connect_btn');
    connect_btn.textContent = "Connect";
    connect_btn.addEventListener("click", ()=> {
        console.log("connect click");
        connect();
    });
    const message_list: HTMLElement = <HTMLElement>document.getElementById("message_list");
    return {
        message_list,
    }
}

let socket: any;
let client_id: string;
let room_id: string;
let user_name: string;

function connect(){
    // console.log("online=", window.navigator.onLine);
    const roomid_text_box: HTMLInputElement = <HTMLInputElement>document.getElementById("roomid_text_box");
    const username_text_box: HTMLInputElement = <HTMLInputElement>document.getElementById("username_text_box");
    room_id = String(roomid_text_box.value);
    user_name = String(username_text_box.value);
    if (room_id==null || room_id=="" || room_id.match(/^[ 　\r\n\t]*$/)) {
        alert("部屋名を入力してください");
        return;
    }
    if (user_name==null || user_name=="" || user_name.match(/^[ 　\r\n\t]*$/)) {
        user_name = "名無し";
        username_text_box.value = user_name;
    }

    // serverに接続
    socket = io(`http://localhost:${PORT}`);
    socket.on("connect", () => {
        console.log('connect!!');
        connected();
    });
    socket.on("join_client", (data: any) => {
        console.log("join_client");
        const li: HTMLElement = <HTMLElement>document.createElement("li");
        li.className = "list-group-item mb-1";
        li.textContent = `${data.user_name} is join!`;
        load().message_list.appendChild(li);
    });

    // socket.on("join_client", ($data: { message: object }) => {
    //     const data = JSON.stringify($data.message);
    //     console.log(data);
    //     const li: HTMLElement = <HTMLElement>document.createElement("li");
    //     li.className = "list-group-item mb-1";
    //     li.textContent = `${data}`;
    //     load().message_list.appendChild(li);
    // });
    
    // connected();
    // socket.on("connected", ($client_id: string)=> {
    //     client_id = $client_id;
    //     console.log(`clientId: ${client_id}, roomId: ${room_id}, user_name: ${user_name}`);
    // });
}

// 接続時に呼ばれる
function connected(){
    if (socket!=null && socket.connected) {
        const connect_btn: HTMLInputElement = <HTMLInputElement>document.getElementById('connect_btn');
        connect_btn.textContent = "Disconnect";
        connect_btn.className = "btn btn-danger"
        connect_btn.addEventListener("click", ()=> {
            console.log("disconnect click");
            disconnect();
        });
        
        console.log(`send: ${room_id}, ${user_name}`);
        
        socket.emit("connected_client", { room_id, user_name });
    }
}

function disconnect(){
    if (socket == null || !socket.connected) return;
    socket.disconnect();
    socket.on("disconnect", () => {
        console.log('disconnect!!');
        disconnected();
    });
}

// 切断時に呼ばれる
function disconnected() {
    const connect_btn: HTMLInputElement = <HTMLInputElement>document.getElementById('connect_btn');
    connect_btn.textContent = "Connect";
    connect_btn.className = "btn btn-primary"
    connect_btn.addEventListener("click", ()=> {
        console.log("connect click");
        connect();
    });
}

// if (socket != null) {
//     console.log("null でない");
//     socket.on("connect", () => {
//         console.log('connect!!');
//         connected();
//     });
    
//     // serverからメッセージを受信
//     socket.on("server_to_client", (data: { message: object }) => {
//         console.log(JSON.stringify(data.message));
//     });
    
//     socket.on("disconnect", () => {
//         console.log("disconnect!");
//     });
// } else {
//     console.log("is null");
// }

// if (socket!=null && socket.connected) {
//     socket.on("connect", () => {
//         console.log('connect!!');
//         connected();
//     });
// }