import { WebSocketServer } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import  { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });


const checkUser = (token: string): string | null => {
    try {

        const decoded = jwt.verify(token, JWT_SECRET);

        if (typeof decoded == "string") {
            return null;
        }

        if (!decoded || !decoded.userId) {
            return null;
        }

        return decoded.userId;

    } catch (e) {
        return null;
    } 

}





wss.on('connection', (socket, Request) => {
    console.log("connection established"); 

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

 