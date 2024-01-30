'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface SideBarChatListProps{
    friends:User[]
}
const SideBarChatList = ({friends}:SideBarChatListProps) => {
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
                return <li key={friend.id}></li>
        })
    }
    </ul>
  )
}

export default SideBarChatList