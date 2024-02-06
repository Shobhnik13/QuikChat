import SignOutButton from '@/src/components/SignOutButton'
import { Icon, Icons } from '../../../components/Icons'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {FC,ReactNode} from 'react'
import FriendRequestsSidebar from '@/src/components/FriendRequestsSidebar'
import { fetchRedis } from '@/src/helper/redis'
import { getFriendsByUserId } from '@/src/helper/GetFriendsByUserId'
import SideBarChatList from '@/src/components/SideBarChatList'
interface LayoutProps{
    children:ReactNode
}

interface sideBarOptionsInterface{
    id:number,
    name:string,
    href:string,
    icon:Icon,
}

const Layout=async({children}:LayoutProps)=>{
    const session=await getServerSession(authOptions)
    if(!session) notFound()
    // console.log(session.user);
    

    const initialUnseenRequestCount=(await fetchRedis('smembers',`user:${session.user.id}:incoming_friend_requests`) as User[]).length

    const friends=await getFriendsByUserId(session.user.id)
    const sideBarOptions:sideBarOptionsInterface[]=[
        {
            id:1,
            name:'Add-friend',
            href:'/dashboard/add-friend',
            icon:'UserPlus' 
        },
    ]    
    return(
        <div className='w-full flex h-screen'>
            {/* sidebar  */}
            <div className='flex p-4 h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto overflow-x-hidden border-r border-gray-200 bg-white'>
                <Link href={'/dashboard'} className='flex h-16 shrink-0 items-center'>
                    <Icons.Logo className='h-8 w-auto text-indigo-600'/>
                </Link>

                {friends.length>0 ?(<div className='text-sm font-semibold leading-6 text-gray-400'>
                    Your chats
                </div>)
                :null
                    }
                <nav className='flex flex-1 flex-col'>
                    <ul className='flex flex-1 flex-col gap-y-7' role='list'>
                        <li><SideBarChatList sessionId={session.user.id} friends={friends}/></li>
                        <li>
                            <div className='text-sm font-semibold leading-6 text-gray-400'>
                                Overview
                            </div>

                            <ul role='list' className='-mx-2 mt-2 space-y-1'>
                                {sideBarOptions.map((item)=>{
                                    const Icon=Icons[item.icon]
                                    return(
                                    <li key={item.id} >
                                        <Link
                                         href={item.href}
                                         className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold'
                                         >
                                            <span className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                                                <Icon className='h-4 w-4' />
                                            </span>

                                            <span className='truncate'>{item.name}</span>
                                        </Link>
                                    </li>
                                )
                                })}
                        <li><FriendRequestsSidebar sessionId={session.user.id} initialUnseenRequestCount={initialUnseenRequestCount}/></li>
                    </ul>
                </li>



                        <li className='-mx-6 mt-auto flex items-center'>
              <div className='flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-gray-900'>
                <div className='relative h-8 w-8 bg-gray-50'>
                  <Image
                    fill
                    referrerPolicy='no-referrer'
                    className='rounded-full'
                    src={session?.user.image || ''}
                    alt='Your profile picture'
                  />
                </div>

                <span className='sr-only'>Your profile</span>
                <div className='flex flex-col'>
                  <span aria-hidden='true'>{session?.user.name}</span>
                  <span className='text-xs text-zinc-400' aria-hidden='true'>
                    {session?.user.email}
                  </span>
                </div>
              </div>
                    <SignOutButton />
            </li>
                    </ul>   
                </nav>
            </div>
            {children}
        </div>
    )
}

export default Layout