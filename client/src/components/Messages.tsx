'use client'

import { useState } from "react"
import { cn } from "../lib/utils"

interface messageProps{
  initialMessages:Message[],
  sessionId:string,
}

const Messages = ({initialMessages,sessionId}:messageProps) => {
  const [messages,setMessages]=useState<Message[]>(initialMessages)
  return (
    <div id="messages" className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto">
      {messages.map((message,index)=>{
          //first we will determine that this message is sent by a session or a friend
          //this will help to poisiton and colour messges accrodingly
          const sentByCurrentUser=message.senderId === sessionId
          //as we want to style something unique after every sent mesage by session
          //so we need to figur eout that the sent message has any next message by same user(session)
          // means 2-3 concurrent messages by same user
          // as here we are comparing that the prev message ie->n-1 of message array has a sender which is same as the curr message ie->n of message 
          // so messages[index-1].senderid:prevmessage === messages[index].senderid:currmessage as this is a concurrent message to prev message
          const hasNextMessageFromSameUser= messages[index-1]?.senderId === messages[index].senderId
          return <div key={`${message.id}-${message.timestamp}`}>
                    <div className={cn('flex items-end',{'justify-end':sentByCurrentUser})}>
                        <div className={cn('flex flex-col space-y-2 text-base max-w-xs mx-2',{'order-1 items-end':sentByCurrentUser, 'order-2 items-start':!sentByCurrentUser})}>
                          <span className={cn('px-4 py-2 rounded-lg inline-block',{
                            'bg-indigo-600 text-white':sentByCurrentUser,
                            'bg-gray-200 text-gray-900':!sentByCurrentUser 
                          })}>
                            {message.text}{' '}
                            <span className="ml-2 text-xs text-gray-400">{message.timestamp}</span>
                          </span>
                        </div>
                    </div>
                </div>
           
      })}
    </div>
  )
}

export default Messages