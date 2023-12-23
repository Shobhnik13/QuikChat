'use client'

import { Check, UserPlus, X } from "lucide-react"
import { useState } from "react"

interface FriendRequestsProps{
    allIncomingFriendRequests:IncomingFriendRequest[],
    sessionId:string,
}
const FriendRequests = ({allIncomingFriendRequests,sessionId}:FriendRequestsProps) => {
    const [friendRequests,setFriendRequests]=useState<IncomingFriendRequest[]>(allIncomingFriendRequests)
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
              aria-label='accept request'
              className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
              <Check className='font-semibold text-white w-3/4 h-3/4' />
            </button>

            <button
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