'use client'

import toast, { type Toast } from "react-hot-toast"
import { chatLinkConstructr, cn } from "../lib/utils"
import Image from "next/image"
interface unseenChatToast{
    t:Toast
    sessionId:string,
    senderId:string,
    senderImg:string,
    senderName:string,
    senderMessage:string,
}
const UnseenChatToast = ({t,sessionId,senderImg,senderId,senderName,senderMessage}:unseenChatToast) => {
  return (
    <div className={cn(`max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`,{
        'animate-enter':t.visible,
        'animate-leave':!t.visible        
    })}>
        <a onClick={()=>toast.dismiss(t.id)} className="flex-1 w-0 p-4" href={`/dashboard/chat/${chatLinkConstructr(sessionId,senderId)}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    <div className="relative w-10 h-10">
                        <Image src={senderImg} alt={`${senderName} profile picture`} referrerPolicy="no-referrer" fill className="rounded-full" />
                    </div>
                </div>

                <div className="flex-1 ml-3">
                    <p className="text-sm font-medium text-gray-900">{senderName}</p>
                    <p className="pt-1 text-sm text-gray-500">{senderMessage}</p>
                </div>
            </div>
        </a>

        <div className="flex border-1 border-gray-200">
            <button onClick={()=>toast.dismiss(t.id)} className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm  font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Close
            </button>
        </div>
    </div>
  )
}

export default UnseenChatToast