'use client'

import axios from "axios"
import { Check, UserPlus, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { pusherClient } from "../lib/pusher"
import { toPusherKey } from "../lib/utils"

interface FriendRequestsProps{
    allIncomingFriendRequests:IncomingFriendRequest[],
    sessionId:string,
}
const FriendRequests = ({allIncomingFriendRequests,sessionId}:FriendRequestsProps) => {
    const router=useRouter()
    console.log(sessionId);
    
    //state for storing all requests
    const [friendRequests,setFriendRequests]=useState<IncomingFriendRequest[]>(allIncomingFriendRequests)

    //setting up sockets using pusher
    useEffect(()=>{
      // subscribe to channel from backend route where we will get the data from

      pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
      
      const friendRequestHandler=()=>{
        console.log('new friend request received!')
      }
      
      // now bind the keyword or sentence u wanna show when this function(friendrequesthadnler) occurs
      
      pusherClient.bind('incoming_friend_requests',friendRequestHandler)
      
      //now cleaning up the connection after returning 
      return ()=>{
          pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
          pusherClient.unbind('incoming_friend_requests',friendRequestHandler)
      }
    })



    //accepting request
    const acceptFriend=async(senderId:string)=>{
      await axios.post('/api/friends/accept',{id:senderId})
      //setting state
      setFriendRequests((prev)=>prev.filter((request)=>request.senderId!==senderId))
      //refreshing page
      router.refresh()
    }

    //denying request
    const denyFriend=async(senderId:string)=>{
      await axios.post('/api/friends/deny',{id:senderId})
      //setting state
      setFriendRequests((prev)=>prev.filter((request)=>request.senderId!==senderId))
      //refreshing page
      router.refresh()
    }

  return (
    <div>
        {friendRequests.length === 0?(
        <p className='text-sm text-zinc-500'>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className='flex gap-4 items-center'>
            <UserPlus className='text-black' />

            <p className='font-medium text-lg'>{request.senderEmail}</p>

            <button
            onClick={()=>acceptFriend(request.senderId)}
              aria-label='accept request'
              className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>

            <button
            onClick={()=>denyFriend(request.senderId)}
              aria-label='deny request'
              className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
              <X className='font-semibold text-white w-3/4 h-3/4' />
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default FriendRequests