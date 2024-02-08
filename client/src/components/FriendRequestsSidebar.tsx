'use client'
import { User } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { pusherClient } from "../lib/pusher"
import { toPusherKey } from "../lib/utils"
// import { ErrorBoundary } from "react-error-boundary";

interface FriendRequestsSidebarProps {
    initialUnseenRequestCount: number,
    sessionId: string,
}


const FriendRequestsSidebar = ({ initialUnseenRequestCount, sessionId }: FriendRequestsSidebarProps) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(initialUnseenRequestCount)

    // useEffect(() => {
        // Check if window is defined to ensure code execution on client-side only
        // if (typeof window !== 'undefined') {
            // Subscribing to the event
            // pusherClient.subscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))

            // Function to handle incoming friend requests
            // const friendRequestHandler = () => {
                // setUnseenRequestCount(prev => prev + 1)
            // }

            // Binding the event handler
            // pusherClient.bind('incoming_friend_requests', friendRequestHandler)

            // Clean-up function to unsubscribe and unbind the event
            // return () => {
                // pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:incoming_friend_requests`))
                // pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
            // }
        // }
    // }, [sessionId]) // Empty dependency array to ensure this effect runs only once on mount

    return (
      // <ErrorBoundary fallback={<div>Something went wrong</div>}>
 
        <div>
            <Link href={'/dashboard/friend-requests'}>
                <a className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                    <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                        <User className='h-4 w-4' />
                    </div>
                    <p className='truncate'>Friend requests</p>
                    {unseenRequestCount > 0 ? (
                        <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
                            {unseenRequestCount}
                        </div>
                    ) : null}
                </a>
            </Link>
        </div>
      // </ErrorBoundary>
    )
}

export default FriendRequestsSidebar
