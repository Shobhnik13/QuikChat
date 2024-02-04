import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req:Request){
    try{
        const body=await req.json()
        
        const { text , chatId } : { text:string , chatId:string }=body

        const session=await getServerSession(authOptions)

        if(!session) return new Response('Unauthorised',{status:401})
        
        const [userId1,userId2]=chatId.split('--')

        if(session.user.id !== userId1 && session.user.id !== userId2){
                return new Response('Unauthrised',{status:401})
        }

        const friendId = session.user.id === userId1 ? userId2 : userId1

        const friendList=(await fetchRedis('smembers',`user:${session.user.id}:friends`)) as string[]

        const isFriendOfUser=friendList.includes(friendId) 

        if(!isFriendOfUser){
            return new Response('Unauthorised',{status:401})
        }

    }catch(error:any){
        if(error instanceof z.ZodError){
            return new Response('Inavlid request payload',{status:422})
        }
        return new Response('Invalid request',{status:400})
    }

}