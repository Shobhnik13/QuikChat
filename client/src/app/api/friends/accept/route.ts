import { fetchRedis } from "@/src/helper/redis";
import { authOptions } from "@/src/lib/auth";
import { db } from "@/src/lib/db";
import { pusherServer } from "@/src/lib/pusher";
import { toPusherKey } from "@/src/lib/utils";
import { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req:Request){
    try{
        const body=await req.json()

        //checking the validity 
        const {id:idToAdd}=z.object({id:z.string()}).parse(body)

        //auth check
        const session=await getServerSession(authOptions)
        if(!session?.user.id){
            return new Response('Unauthorised!',{status:401})
        }
        // console.log(session);
        

        //verify that both already friends or not
        const isAlreadyFriends=(await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd))
        // console.log('hi1');
        if(isAlreadyFriends){
            return new Response('You both are friends already!',{status:400})
        }
        
        //checking that the wanna be added user sent a request to session or not
        const hasSentReq=(await fetchRedis('sismember',`user:${session.user.id}:incoming_friend_requests`,idToAdd))
        // console.log('elvissssssssssss bhai!!!!!!!!!');
        
        // console.log(hasSentReq);

        if(!hasSentReq){
            return new Response('No friend request!',{status:400})
        }
        //now just add the friend -> session and vice versa

        //for adding friend in sidebarchatlist comp. and trigerring event of new friend to make that comp. refresh to show new added frined

        await pusherServer.trigger(toPusherKey(`user:${idToAdd}:friends`),'new-friend',{})

        await db.sadd(`user:${session.user.id}:friends`,idToAdd)
        await db.sadd(`user:${idToAdd}:friends`,session.user.id)
        // now removing the added friend from the upcoming_friend_request
        await db.srem(`user:${session.user.id}:incoming_friend_requests`,idToAdd)
        
        // console.log('jdksjdksd')

        return new Response('OK',{status:200})
    }catch(error:any){
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload',{status:422})
        }    

        return new Response('Invalid request!',{status:400})
    }
}