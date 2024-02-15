'use client'
import { format } from 'date-fns'

import { useEffect, useState } from "react"
import { cn, toPusherKey } from "../lib/utils"
import Image from 'next/image'
import { pusherClient } from '../lib/pusher'

interface messageProps{
  initialMessages:Message[],
  sessionId:string,
  chatFriend:User,
  sessionImg:string | null| undefined,
  chatId:string,
}

const Messages = ({initialMessages,chatId,sessionId,sessionImg,chatFriend}:messageProps) => {

  const [messages,setMessages]=useState<Message[]>(initialMessages)
  
  const formatTimeStamp=(timestamp:number)=>{
    return format(timestamp, 'HH:mm')
  }

  useEffect(()=>{
    pusherClient.subscribe(toPusherKey(`chat:${chatId}`))
    
    const messageHandler=(message:Message)=>{
      setMessages((prev)=>[message,...prev])
    }

    pusherClient.bind('incoming-message',messageHandler)
    return ()=>{
      pusherClient.unsubscribe(toPusherKey(`chat:${chatId}`))
      pusherClient.unbind('incoming-message',messageHandler)
    }
  },[chatId])

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
                            <span className="ml-2 text-xs text-gray-400">{formatTimeStamp(message.timestamp)}</span>
                          </span>
                        </div>
                        <div
                className={cn('relative w-6 h-6', {
                  'order-2': sentByCurrentUser,
                  'order-1': !sentByCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                <Image
                  fill
                  src={
                    sentByCurrentUser ? (sessionImg as string) : chatFriend.image
                  }
                  alt='Profile picture'
                  referrerPolicy='no-referrer'
                  className='rounded-full'
                />
              </div>
                    </div>
                </div>
           
      })}
    </div>
  )
}

export default Messages