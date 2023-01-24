import * as http from "http";
import {PORT} from "./config";
import * as socket from "socket.io";

const Server = http.createServer(
    (req, res) => {
        res.end("Hellooooooo");
    }
);

Server.listen(PORT);

console.log(`Access to http://localhost:${PORT}`);