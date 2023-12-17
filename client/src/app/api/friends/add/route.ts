import { authOptions } from "@/src/lib/auth"
import { addFriendSchema } from "@/src/lib/validations/add-friend"
import { getServerSession } from "next-auth"

export async function POST(req:Request){
    try{
        const body=await req.json()

        const {email:emailToAdd} = addFriendSchema.parse(body.email)

        const restResponse=await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,{
            headers:{
                Authorization:`Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`
            },
        cache:'no-store',
        })
        const data=(await restResponse.json()) as {result:string}
        const idToAdd=data.result

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


        // logic for valid calling 
    }catch(error:any){
        console.log(error)
    }
}