import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { addFriendSchema } from "@/src/lib/validations/add-friend"
import { AxiosError } from "axios"
import { getServerSession } from "next-auth"
import { z } from "zod"

export async function POST(req:Request){
    try{
        const body=await req.json()
        // console.log(body.email)
        const {email:emailToAdd} = addFriendSchema.parse(body.email)
        //checking that the entered mail is in db or not
        
        const idToAdd=(await fetchRedis('get',`user:email:${emailToAdd}`)) as string
        if(!idToAdd){
            return new Response('This person does not exist!',{status:400})
        }
        //now we are getting the email id that is calling this email to add as friend
        const session=await getServerSession(authOptions)
        
        // ALL EDGE CASES 

        if(!session){
            throw new Response('Not authorised!',{status:401})
        }

        if(!idToAdd){
            throw new Response('This person does not exist!',{status:400})
        }

        //if the calling person id(session.user.id) and friend id is same
        if(session.user.id === idToAdd){
            throw new Response('You can not add yourself as a friend!',{status:400})
        }

        // check if user is already sent a friend request or not
        // this list will be showed to the emailtoadd list as incoming friend request
        const alreadyAdded=(await fetchRedis('sismember',`user:${idToAdd}:incoming_friend_requests`,session.user.id)) as 0|1
        if(alreadyAdded){
            throw new Response(`User already sent a request!`,{status:400})
        }

        // checking if they are friends already or not
        const alreadyFriend=(await fetchRedis('sismember',`user:${session.user.id}:friends`,idToAdd)) as 0|1
        if(alreadyFriend){
            throw new Response(`Users are already friends with each other!`,{status:400})
        }

        // logic for valid calling/adding 
        // just add the user/emai to add in session.id
        // index->value
        //this means the user ie logged in user(session) will be put in the list of friend requests incoming to the id that the sessions wants to add
        // ex-> abc(session) wants xyz(idtoadd) to be friends
        // so a request by abc(session) would be added in a list of incoming friend request to xyz(idtoadd)
        db.sadd(`user:${idToAdd}:incoming_friend_requests`,session.user.id)
        return new Response('OK',{status:200})
    }catch(error:any){
        // console.log(error)
        if(error instanceof z.ZodError){
            return new Response('Invalid request payload',{status:422})
        }
        return new Response('Inavlid request',{status:400})
         
    }
}