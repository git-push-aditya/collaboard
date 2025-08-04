import {prismaClient} from "@repo/db/prismaClient"

export interface memberCheck {
    isMember : boolean;
    isError : boolean;
}

export const roomMemberCheck = async (userId : number, roomId : number) : Promise<memberCheck>=> {
    try{
        const isMember = await prismaClient.roomsMembers.findFirst({
            where : {
                memberId : userId,
                roomId : roomId
            }
        })

        if(isMember){
            return {isMember : true, isError : false};
        }else{
            return {isMember : false, isError : false};
        }
    }catch(e){
        console.error("error while checking if user is member of the room");
        return {isMember : false, isError : true};
    }
}