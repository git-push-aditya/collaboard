import jwt, { JwtPayload } from "jsonwebtoken"
import { JWT_SECRET } from "./config"
 
interface tokenPayload{
    userId : number
}

interface token{
    token : string
}

interface customPayload extends JwtPayload{
    userId  : number
}


export const generateToken = (payload : tokenPayload) : string | null => {
    if(!JWT_SECRET){
        console.error("JWT SECRET not found");
        return null;
    }

    const token = jwt.sign(payload,JWT_SECRET);
    return token;
}


export const verifyJwt = ({token} : token) : null | number => {
    try{
        const verify = jwt.verify(token, JWT_SECRET) as customPayload;
        if(!verify.userId){
            return null;
        }else{
            return verify.userId;
        }
    }catch(e){
        console.error("Unauthorised access");
        return null;
    }    
}