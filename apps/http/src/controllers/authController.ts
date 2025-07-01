import { Request, Response } from "express";
import { authZod } from "@repo/common/authzod";

export const signUp = ({req,res}:{req : Request,res : Response}) => {
    try{ 
        const typeCheck = authZod.safeParse(req.body);
        if(!typeCheck.success){
            res.status(404).json({
                status : "failure",
                payload : {
                    message: "Invalid type of data passed"
                }
            })
            return;
        }

        const {userName, passwrod} = req.body;

        //db call to check fi exist
        //@ts-ignore 
        const ifExist;

        if(ifExist){
            res.status(400).json({
                status : "failure",
                payload:{
                    message : "username already in use"
                }
            })
            return;
        }else{
            //db call to add user to data base
            //package call to create jwt payload
            //@ts-ignore
            const token = "hola";
            res.status(200).json({
                status : "success",
                payload :{
                    "message" : "user created successfully",
                    "token" : token 
                }
            })
            return;
        }

    }catch(e){
        console.error("Error occured in signin controller\n")
        console.error(e);
        res.status(400).json({
            status : "failure",
            payload :{
                "message" : "server issue"
            }
        })
    }
}

export const signIn = ({req,res} : {req : Request,res : Response}) => {
    try{
        const typeCheck = authZod.safeParse(req.body);
        if(!typeCheck.success){
            res.status(404).json({
                status : "failure",
                payload : {
                    message: "Invalid type of data passed"
                }
            })
            return;
        }
        const {userName, passwrod} = req.body; 

        
        //db call to check fi exist
        //@ts-ignore 
        const ifExist;

        if(!ifExist){
            res.status(400).json({
                status : "failure",
                payload:{
                    message : "username doesnt exist"
                }
            })
            return;
        }else{ 
            //package call to create jwt payload
            //@ts-ignore
            const token = "hola";
            res.status(200).json({
                status : "success",
                payload :{
                    "message" : "signed in successfully",
                    "token" : token 
                }
            })
            return;
        }

    }catch(e){
        console.error("Error occured in signin controller\n")
        console.error(e);
        res.status(400).json({
            status : "failure",
            payload :{
                "message" : "server issue"
            }
        })
    }
}