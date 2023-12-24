import { fetchRedis } from "@/src/helper/redis";
import { authOptions } from "@/src/lib/auth";
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
        // console.log('hi2');
        
        // console.log(hasSentReq);

        // if(YAHA SE NOT SENT REQ THEN NOT ADD ELSE ADD )
        return new Response('OK',{status:200})
    }catch(error:any){
        console.log(error);
    }
}