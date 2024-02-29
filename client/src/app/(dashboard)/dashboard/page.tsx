import { getFriendsByUserId } from '@/src/helper/GetFriendsByUserId'
import { fetchRedis } from '@/src/helper/redis'
import { authOptions } from '@/src/lib/auth'
import { chatLinkConstructr } from '@/src/lib/utils'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import React from 'react'

const Page = async() => {
  const session=await getServerSession(authOptions) 
  if(!session) redirect('/login')  

  const friends=await getFriendsByUserId(session.user.id)
  const friendsWithRecentMessage=await Promise.all(
    friends.map(async(friend)=>{
      const [lastMessageRaw] = await fetchRedis('zrange',`chat:${chatLinkConstructr(session.user.id,friend.id)}:messages`,-1,-1) as string[]
      const lastMessage=JSON.parse(lastMessageRaw) as Message
    return {
      ...friend,
      lastMessage
    }
    })
  )
  // console.log('friendsWithRecentMessage',friendsWithRecentMessage)
  return (
    <div className='flex flex-col py-12'>
        <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
        {
          friendsWithRecentMessage.length === 0 ? (
            <p className='text-sm text-zinc-5000'>Nothing to show here....</p>
          ):
          friendsWithRecentMessage.map((friend)=>(
            <div className='flex justify-between bg-zinc-50 border border-zinc-200 p-3 rounded-lg' key={friend.id}>
                
                <Link href={`/dashboard/chat/${chatLinkConstructr(session.user.id,friend.id)}`} className='hover:cursor-pointer flex items-center'>
                    <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                        <div className='relative w-10 h-10'>
                            <Image fill src={friend.image} referrerPolicy='no-referrer' className='rounded-full' alt={`${friend.name} profile picture`}/>
                        </div>
                    </div>
                    
                    <div>
                      <h4 className='text-lg font-semibold'>{friend.name}</h4>
                      <p className='mt-1 max-w-md'>
                        <span className='text-zinc-400'>
                          {friend.lastMessage.senderId === session.user.id? 'You: ' : ''}
                        </span>
                        {friend.lastMessage.text}
                      </p>
                    </div>
                </Link>

                <div className='flex items-center'>
                  <ChevronRight className='w-7 h-7 text-zinc-400'/>
                </div>
                
            </div>
          ))
        }
    </div>
  )
}

export default Page