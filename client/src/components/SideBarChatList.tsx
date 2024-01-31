'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { chatLinkConstructr } from "../lib/utils"

interface SideBarChatListProps{
    friends:User[],
    sessionId:string
}
const SideBarChatList = ({friends,sessionId}:SideBarChatListProps) => {
    const [unseenMessage,setUnseenMessage]=useState<Message[]>([])
    const router=useRouter()
    const pathname=usePathname()
    //will render only when the path that is chatting person changes(chatid in url)
    useEffect(()=>{
        //if the pathname includes chat word then the user is chatting with a person
        if(pathname?.includes('chat')){
            //then we will set the unseen messages except this user with whom we are chatting with
            setUnseenMessage((prev)=>{
                return prev.filter((msg)=>!pathname?.includes(msg.senderId))
            })
        }
    },[pathname])
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
    {
        friends.sort().map((friend)=>{
                const unseeenMessageCountOfPersonalFriend=unseenMessage.filter((unseenMsg)=>{
                    return unseenMsg.senderId === friend.id
                }).length
                return <li key={friend.id}>
                    <a className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md text-sm leading-6 font-semibold" href={`/dashboard/chat/${chatLinkConstructr(sessionId,friend.id)}`}>
                        {friend.name}
                        {unseeenMessageCountOfPersonalFriend>0 ?(<>
                        <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 flex justify-center items-center">
                            {unseeenMessageCountOfPersonalFriend}
                        </div>
                        </>):(null) }    
                    </a>
                </li>
        })
    }
    </ul>
  )
}

export default SideBarChatList