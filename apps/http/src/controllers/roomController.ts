import { Request, Response } from "express";
import { prismaClient } from "@repo/db/prismaClient";
import { verifyJwt } from "@repo/backend-common/JWTHandler";
import type { memberCheck } from "../middlewares/roomMemberCheck";
import {roomMemberCheck} from "../middlewares/roomMemberCheck";

export const createRoom = async (req: Request, res: Response) => {
    try { 

        const userId = verifyJwt({token : req.headers.token as string ?? ""})

        if(!userId){
            res.status(400).json({
                status: "failure",
                payload : {
                    message : "Unauthorized access, re-login"
                }
            })
            return;
        }

        const { roomName, password, capacity } = req.body;

        const ifExist = await prismaClient.room.findFirst({
            where : {
                slug : roomName
            }
        })
 
        if (ifExist) {
            res.status(400).json({
                status : "failure",
                payload: {
                    message: "Room with such name already exist"
                }
            })
        } else { 

            const refinedCapacity = capacity < 50 ? capacity : 50; 
            
            const newRoom = await prismaClient.room.create({
                data : {
                    slug : roomName,
                    password : password,
                    totalCapacity : refinedCapacity,
                    adminId : userId 
                },select : { 
                    password : true,
                    slug : true,
                    totalCapacity : true,
                    id : true,
                    admin : {
                        select :{
                            user : {
                                select :{
                                    userName : true
                                }
                            }
                            
                        }
                    }
                }
            })

            res.status(200).json({
                status: "Room created successfully",
                payload: {
                    message: "Room created success fully",
                    roomId : newRoom.id,
                    roomName: newRoom.slug,
                    roomPass: newRoom.password,
                    roomCapacity: newRoom.totlaCapacity,
                    owner: newRoom.admin.userName
                }
            })
        }
    } catch (e) {
        console.error("Error occured in room controller\n")
        console.error(e);
        res.status(400).json({
            status : "failure",
            payload :{
                message : "server issue, creating a room"
            }
        })
    }   
}

export const joinRoom = async (req: Request, res: Response ) => {
    try{
        const {roomName, password} = req.body;
        const userId = verifyJwt({token : req.headers.token as string ?? ""}) 
        if(!userId){
            res.status(400).json({
                status: "failure",
                payload :{ 
                    message : "unauthorized access; re-login"
                }
            })
            return;
        }
        
        const roomsData = await prismaClient.room.findFirst({
            where : {
                slug : roomName
            },select : {
                id : true,
                slug : true,
                currentCapacity : true,
                totalCapacity : true,
                password : true
            }
        })

        if(!roomsData){
            res.status(404).json({
                status : "failure",
                payload : {
                    message : "room not found, incorrect room name"
                }
            })
            return;
        }else{
            if(roomsData.password != password){
                res.status(401).json({
                    status : "failure",
                    payload : {
                        message : "Incorrect credentials,retry"
                    }
                })
                return;
            }else{
                //passed credentials
                if(roomsData.currentCapacity === roomsData.totalCapacity){
                    res.status(403).json({
                        status : "failure",
                        payload : {
                            message : "Room limit reached; cannot enter this room"
                        }
                    })
                    return;
                }else{
                    
                    const isAlreadyAmember : memberCheck = await roomMemberCheck(userId, roomsData.id)

                    if(isAlreadyAmember.isError){
                        res.status(400).json({
                            status : "failure",
                            payload : {
                                message : "internal server error"
                            }
                        })
                        return;
                    }
                    
                    if(isAlreadyAmember.isMember){
                        res.status(200).json({
                            status : "success",
                            payload : {
                                message : "You are already a member of this room",
                                roomId : roomsData.id,
                                roomName : roomsData.slug,
                                currentCapacity : roomsData.currentCapacity,
                                totalCapacity : roomsData.totalCapacity                                
                            }
                        })
                        return;
                    }

                    await prismaClient.$transaction(async(tx : any)=>{
                        await tx.room.update({
                            where : {
                                slug : roomName
                            },data:{
                                currentCapacity : roomsData.currentCapacity + 1
                            }
                        });

                        await tx.roomsMember.create({
                            data : {
                                roomId : roomsData.id,
                                memberId : userId
                            }
                        })
                    }) 

                    res.status(200).json({
                        status : "success",
                        payload : {
                            message : "room joined successfully",
                            roomCred : {
                                roomId : roomsData.id,
                                roomName : roomsData.slug,
                                currentCapacity : roomsData.currentCapacity,
                                totalCapacity : roomsData.totalCapacity
                            }
                        }
                    })

                    return;

                }              

            }
            
        }


    }catch(e){
        console.error("Some error in join room endpoint",e);
        res.status(400).json({
            status : "failure",
            payload : {
                message : "internal server error"
            }
        })
    }
}

export const allMembers = async (req:Request, res : Response) => {
    try{
        const {roomName,roomId} = req.body;
        const userId = verifyJwt({token : req.headers.token as string ?? ""}) 
        if(!userId){
            res.status(400).json({
                status: "failure",
                payload :{ 
                    message : "unauthorized access; re-login"
                }
            })
            return;
        }

        const isAlreadyAmember : memberCheck = await roomMemberCheck(userId, roomId)

        if(isAlreadyAmember.isError){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "internal server error"
                }
            })
            return;
        }
        
        if(!isAlreadyAmember.isMember){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "Unauthorized access; you are not the memebr of this room"         
                }
            })
            return;
        }

        const membersDetail = await prismaClient.room.findFirst({
            where : {
                slug : roomName
            },select : {
                admin : {
                    select : {
                        user : {
                            select :{
                                userName : true
                            }
                        }
                    }
                } ,member : {
                    select : {
                        roomsMember : {
                            select : {
                                member :{
                                    select : {
                                        user :{
                                            userName : true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        if(!membersDetail){
            res.status(400).json({
                status : "failure",
                payload: {
                    message : "no such room exist"
                }
            });
        }else{
            //need to refine memebrsDetail for admin tag
            res.status(200).json({
                status : "success",
                payload : {
                    message : "Members list found",
                    membersList : membersDetail
                }
            })
        }

        return;
    }catch(e){
        console.error("Some error occured\n\n", e);
        res.status(400).json({
            status : "failure",
            payload :{
                message : "Internal server error"
            }
        })
        return;
    }
}


export const allChats = async (req: Request, res : Response) => {
    try{
        const {roomName, roomId} = req.body;
        const userId = verifyJwt({token : req.headers.token as string ?? ""}) 
        if(!userId){
            res.status(400).json({
                status: "failure",
                payload :{ 
                    message : "unauthorized access; re-login"
                }
            })
            return;
        }

        const isAlreadyAmember : memberCheck = await roomMemberCheck(userId, roomId)

        if(isAlreadyAmember.isError){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "internal server error"
                }
            })
            return;
        }
        
        if(!isAlreadyAmember.isMember){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "Unauthorized access; you are not the memebr of this room"         
                }
            })
            return;
        }        
        

        const allMessages = await prismaClient.chat.findMany({
            where : {
                roomId : roomId
            },select : {
                senderId : true,
                id : true,
                sender : {
                    select : {
                        user : {
                            select : {
                                userName : true
                            }
                        }
                    }
                }
            }
        })/// clean it based on if the user is the sender

        res.status(200).json({
            status : "success",
            payload : {
                message : "fetched all messages",
                allShapes : allMessages
            }
        })
        

    }catch(e){
        console.error("Some error occured in getting the message",e)
        res.status(400).json({
            status : "failure",
            payload :{
                message : "internal server error"
            }
        })
    }
}


export const addMessage = async (req :Request, res : Response) => {
    try{ 
        const {roomId,message} = req.body;

        const userId = verifyJwt({token : req.headers.token as string ?? ""}) 
        if(!userId){
            res.status(400).json({
                status: "failure",
                payload :{ 
                    message : "unauthorized access; re-login"
                }
            })
            return;
        }

        const isAlreadyAmember : memberCheck = await roomMemberCheck(userId, roomId);

        if(isAlreadyAmember.isError){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "internal server error"
                }
            })
            return;
        }
        
        if(!isAlreadyAmember.isMember){
            res.status(400).json({
                status : "failure",
                payload : {
                    message : "Unauthorized access; you are not the memebr of this room"         
                }
            })
            return;
        }          
        
        const messagePosted = await prismaClient.chat.create({
            data :{
                message,
                senderId : userId,
                roomId
            },select :{
                id : true,
                roomId:true,
                senderId : true
            }
        })

        res.status(200).json({
            status : "success",
            payload : {
                message : "saved to db",
                messageId : messagePosted.id,
                roomId: messagePosted.roomId,
                senderId : messagePosted.senderId
            }
        })

    }catch(e){
        console.error("error posting mssg to db",e);
        res.status(400).json({
            status :"failure",
            payload :{
                message : "internal server error"
            }
        })
    }
}