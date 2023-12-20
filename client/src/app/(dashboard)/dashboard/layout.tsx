import { Icons } from '../../../components/Icons'
import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {FC,ReactNode} from 'react'
interface LayoutProps{
    children:ReactNode
}
const Layout=async({children}:LayoutProps)=>{
    const session=await getServerSession(authOptions)
    // if(!session) notFound()
    return(
        <div className='w-full flex h-screen'>
            {/* sidebar  */}
            <div className='flex p-4 h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white'>
                <Link href={'/dashboard'} className='flex h-16 shrink-0 items-center'>
                    <Icons.Logo className='h-8 w-auto text-indigo-600'/>
                </Link>

                <div className='text-sm font-semibold leading-6 text-gray-400'>
                    Your chats
                </div>
            </div>
            {children}
        </div>
    )
}

export default Layout