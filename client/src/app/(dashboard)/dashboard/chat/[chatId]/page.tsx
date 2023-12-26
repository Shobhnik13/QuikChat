import { authOptions } from "@/src/lib/auth"
import { db } from "@/src/lib/db"
import { getServerSession } from "next-auth"
import { notFound } from "next/navigation"

interface ChatPageProps{
    params:{
        chatId:string,
    }
}

const page = async({params}:ChatPageProps) => {
    const { chatId }=params
    const session=await getServerSession(authOptions) 
    if(!session) notFound()
    // coz we will have this type of layout in chatUrl-> dashboard/chat/user1--user2 or dashboard/chat/user2--user1 both will contain same chats no matter what session(logged in user) is
    const [userId1,userId2]=chatId.split('--')
    // now if a user wants to see this page so 
    // definitely the user should be either user1(session-logged in one) or a user2(friend with whom session-user1 is chatting) or vice versa
    if(session.user.id !== userId1 || session.user.id !== userId2){
        notFound()
    }
    //now determining which is the friend id
    // we will check by comparing both id to session
    const chatFriendId=session.user.id===userId1?userId2:userId1
    //getting name for chatfriend
    const chatFriend=(await db.get(`user:${chatFriendId}`)) as User
    
    return (
    <div>{chatId}</div>
  )
}

export default page