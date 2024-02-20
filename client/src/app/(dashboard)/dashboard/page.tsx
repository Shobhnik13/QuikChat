import { getFriendsByUserId } from '@/src/helper/GetFriendsByUserId'
import { fetchRedis } from '@/src/helper/redis'
import { authOptions } from '@/src/lib/auth'
import { chatLinkConstructr } from '@/src/lib/utils'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import React from 'react'

const Page = async() => {
  const session=await getServerSession(authOptions) 
  if(!session) return notFound()  

  const friends=await getFriendsByUserId(session.user.id)
  const friendsWithRecentMessage=await Promise.all(
    friends.map(async(friend)=>{
      const [lastMessage] = await fetchRedis('zrange',`chat:${chatLinkConstructr(session.user.id,friend.id)}:messages`,-1,-1) as Message[]
    return {
      ...friend,
      lastMessage
    }
    })
  )
  // console.log('friendsWithRecentMessage',friendsWithRecentMessage)
  return (
    <div>
        hi
    </div>
  )
}

export default Page