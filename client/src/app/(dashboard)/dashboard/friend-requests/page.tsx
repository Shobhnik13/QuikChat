import FriendRequests from "@/src/components/FriendRequests"
import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

const RequestsPage = async() => {
    const session=await getServerSession(authOptions)
    
    if(!session) notFound()
    //ids of people who sent the friend-requests to the session id(currently logged in person) 
    const incomingSenderIds=(await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`)) as string[]
    // console.log(incomingSenderIds)

    //but we want emails not ids
    //as if an account have 3 upcoming requests so we DO NOT want to show one by one
    //so will wait for all requests to show at same time 
    //so using promise.all which will wait for all the 3 requests
    // and in promise.all we will map all the 3 ids one by one by passing an async function
    //and that fun will send all 3ids one by one and will get the emails
    //and then due to promsie.all all 3 emails will returned at same time 
    const incomingFriendRequests=await Promise.all(
        incomingSenderIds.map(async(senderId)=>{
            const sender=(await fetchRedis('get',`user:${senderId}`)) as string
            const senderParsed = JSON.parse(sender) as User
            return{
                senderId,
                senderEmail:senderParsed.email,
            }
        })
        )
        console.log(incomingFriendRequests);
    
  return (
    <main className="pt-8">
        <h1 className="font-bold text-5xl mb-8">Add a friend</h1>
        <div className="flex flex-col gap-4">
            <FriendRequests sessionId={session.user.id} allIncomingFriendRequests={incomingFriendRequests}/>
        </div>
    </main>
  )
}

export default RequestsPage