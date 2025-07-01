import { Request, Response } from "express";


export const createRoom = ({ req, res }: { req: Request, res: Response }) => {
    try { 
        const { roomName, passwrod, capacity, userId } = req.body;
        //db call to check is such room already exist
        //@ts-ignore
        const ifExist = "";
        if (ifExist) {
            res.status(400).json({
                "status": "failure",
                "payload": {
                    "message": "Room with such name already exist"
                }
            })
        } else {
            //dod this in db call before adding => capacity : capacity > 50 ? 50 : capacity;
            //db call to create room
            //make sure to add userId as rooms owner
            //@ts-ignore
            const room;
            res.status(200).json({
                "status": "Room created successfully",
                "payload": {
                    "message": "Room created success fully",
                    "roomName": room.name,
                    "roomPass": room.pass,
                    "roomCapacity": room.capacity,
                    "owner": room.capcity
                }
            })
        }
    } catch (e) {
        console.error("Error occured in room controller\n")
        console.error(e);
        res.status(400).json({
            status : "failure",
            payload :{
                "message" : "server issue, creating a room"
            }
        })
    }   
}

export const joinRoom = ({req,res} : { req: Request, res: Response }) => {
    try{
        const {roomName, passwrod, userId} = req.body;
        //db call to get the room's data like : id,totalcapacity, current capacity,roomname and password
        //@ts-ignore
        let roomsData ;    

        if(!roomsData){
            res.status(404).json({
                status : "failure",
                payload : {
                    message : "room not found, incorrect room name"
                }
            })
            return;
        }else{
            if(roomsData.password != passwrod){
                res.status(401).json({
                    status : "failure",
                    payload : {
                        message : "Incorrect credentials,retry"
                    }
                })
                return;
            }else{
                //passed credentials
                if(roomsData.currentCapacity === roomsData.totalcapacity){
                    res.status(403).json({
                        status : "failure",
                        payload : {
                            message : "Room limit exceeded; cannot enter room"
                        }
                    })
                    return;
                }else{
                    //increase currrent capacity of room in db
                    //get data of room 
                    res.status(200).json({
                        status : "success",
                        payload : {
                            message : "room joined successfully",
                            roomCred : {
                                roomId : roomsData.id,
                                roomName : roomsData.name,
                                currentCapacity : roomsData.currentCapacity,
                                totalCapacity : roomsData.totalCapacity
                            },
                            data : "data" //all the data user needs like current sketecje ets
                        }
                    })

                    return;

                }              

            }
            
        }


    }catch(e){

    }
}


//som eenpoints that gets various rooms data like chat, viodeo stuff and current positions of data