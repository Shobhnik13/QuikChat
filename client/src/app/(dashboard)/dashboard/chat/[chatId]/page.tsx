import ChatInp from "@/src/components/ChatInp"
import Messages from "@/src/components/Messages"
import { fetchRedis } from "@/src/helper/redis"
import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { messageArraySchema } from "@/src/lib/validations/messages-validator"
import { getServerSession } from "next-auth"
import Image from "next/image"
import { notFound } from "next/navigation"

interface ChatPageProps{
    params:{
        chatId:string,
    }
}
async function getChatMessages(chatId:string) {
    try{
        const result:string[]=await fetchRedis('zrange',`chat:${chatId}:messages`,0,-1)
        const dbMessages=result.map((message)=>JSON.parse(message) as Message)
        //displaying message in reverse order coz we are fetching from 0th indx to end
        //so the recent message will be at top but we need that at the end
        const reversedDbMessages=dbMessages.reverse()
        //validating it
        const messages= messageArraySchema.parse(reversedDbMessages)
        return messages
    }catch(error:any){
        notFound()
    }
}

const page = async({params}:ChatPageProps) => {
    const { chatId }=params
    const session=await getServerSession(authOptions) 
    if(!session) notFound()
    const { user }=session
    // coz we will have this type of layout in chatUrl-> dashboard/chat/user1--user2 or dashboard/chat/user2--user1 both will contain same chats no matter what session(logged in user) is
    const [userId1,userId2]=chatId.split('--')
    // now if a user wants to see this page so 
    // definitely the user should be either user1(session-logged in one) or a user2(friend with whom session-user1 is chatting) 
    //so if the user is neither id 1 nor id2 then notfound() 
    // if(session.user.id !== id1 && session.user.id !== id2){notfound()}
    //it means if the session id is neither of id1,id2 then not found else return the page
    if(user.id !== userId1 && user.id !== userId2){
        notFound()
    }
    //now determining which is the friend id
    // we will check by comparing both id to session
    const chatFriendId= user.id === userId1 ? userId2 : userId1
    //getting name for chatfriend
    // const chatFriend=(await db.get(`user:${chatFriendId}`)) as User
    const chatFriend=await fetchRedis('get',`user:${chatFriendId}`) as string
    const parsedChatFriend=JSON.parse(chatFriend) as User
    // console.log(chatFriend)
    //getting chats
    const initialMessages=await getChatMessages(chatId)
    return (
    <div className="flex-1 justify-between flex flex-col h-full ">
        <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div className="relative flex items-center space-x-4">
                <div className="relative">
                    <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                        <Image
                        fill
                        referrerPolicy='no-referrer'
                        src={parsedChatFriend.image}
                        alt={`${parsedChatFriend.name} profile picture`}
                        className='rounded-full'/>
                    </div>
                </div>

                <div className="flex flex-col leading-tight">
                    <div className="text-xl flex items-center">
                        <span className="text-gray-700 mr-3 font-semibold">
                            {parsedChatFriend.name}
                        </span>
                    </div>

                <span className="text-sm text-gray-600">{parsedChatFriend.email}</span>
                </div>
            </div>
        </div>
        <Messages sessionId={session.user.id} initialMessages={initialMessages}/>
        <ChatInp ChatPartner={parsedChatFriend}/>
    </div>
  )
}

export default page