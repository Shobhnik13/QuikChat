import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { messageSchema } from "@/src/lib/validations/messages-validator"
import { getServerSession } from "next-auth"
import { nanoid } from 'nanoid'
export async function POST(req:Request){
    try{
        
        const { text , chatId } : { text:string , chatId:string }=await req.json()

        const session=await getServerSession(authOptions)

        if(!session) return new Response('Unauthorised',{status:401})
        
        const [userId1,userId2]=chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !== userId2){
                return new Response('Unauthrised',{status:401})
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
