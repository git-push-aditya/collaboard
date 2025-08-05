import { WebSocketServer } from "ws";
import { verifyJwt } from "@repo/backend-common/JWTHandler"


const wss = new WebSocketServer({ port: 8080 });


const checkUser = (token: string): number | null => { 
    return verifyJwt({token}); 
}


wss.on('connection', (socket, Request) => { 

    const url = Request.url;
    if (!url) return;

    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token') || "";
    const userId = checkUser(token);

    if (!userId) {
        socket.close();
    }


    socket.on('message', () => {
        socket.send("pong")
    })


})

 