import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { messageSchema } from "@/src/lib/validations/messages-validator"
import { getServerSession } from "next-auth"
import { nanoid } from 'nanoid'
import { pusherServer } from "@/src/lib/pusher"
import { toPusherKey } from "@/src/lib/utils"
export async function POST(req:Request){
    try{
        
        const { text , chatId } : { text:string , chatId:string }=await req.json()

        const session=await getServerSession(authOptions)

        if(!session) return new Response('Unauthorised',{status:401})
        
        const [userId1,userId2]=chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !== userId2){
                return new Response('Unauthorised',{status:401})
        }
        // extracting the friendid
        const friendId = session.user.id === userId1 ? userId2 : userId1
        
        //checking that the friend id is a part of session friends list
        const friendList=(await fetchRedis('smembers',`user:${session.user.id}:friends`)) as string[]

        const isFriendOfUser=friendList.includes(friendId) 

        if(!isFriendOfUser){
            return new Response('Unauthorised',{status:401})
        }
        //fetching the sender to send message
        const sender=await fetchRedis('get',`user:${session.user.id}`) as string
        const parsedSender=JSON.parse(sender) as User
        // console.log(parsedSender)

        //now all checks passed(session check, chatid with session check, friendid in friend list of session check, sender fetching)
        
        const timestamp=Date.now()
        
        const messageData:Message={
            id: nanoid(),
            senderId:session.user.id,
            text,
            timestamp,
            receiverId:friendId,
        }

        const message=messageSchema.parse(messageData)

        // this server emits message to all clients in message.tsx component to display message
        await pusherServer.trigger(toPusherKey(`chat:${chatId}`), 'incoming-message', message)
        
        // this server emits message that this user receives in any of his chats to show at frontend
        // ex- abcd sent a message to xyz and efg also sent to xyz so this server will emit
        // messages that are sent by abcd and efg to xyz
        // so now we can show that these 2 are the new message or unseen message for xyz from abcd and efg resp.
        await pusherServer.trigger(toPusherKey(`user:${friendId}:chats`),'new-message',{
            // this means we will send a new TYPE of message which includes property of old message type
            // ie id,senderid,recid,text,timestamp
            // but also we attach img and name of sender for frontend to listen
            // that we will show that who sent this new message as toast
            ...message,
            senderImg:parsedSender.image,
            senderName:parsedSender.name,
        })

        await db.zadd(`chat:${chatId}:messages`,{
            score:timestamp,
            member:JSON.stringify(message)
        })
        return new Response('OK',{status:200})
    }catch(error:any){
        if(error instanceof Error){
            return new Response(error.message,{status:500})
        }
        return new Response('Internal server error',{status:500})
    }

}
