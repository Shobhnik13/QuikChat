'use client'
import { useRef, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import Button from './ui/button';
import axios from 'axios';
import toast from 'react-hot-toast';

interface chatInpProps{
    ChatPartner:User,
    chatId:string
}


const ChatInp = ({ChatPartner,chatId}:chatInpProps) => {
    //we are creating this ref to have an instance of current when we are at this textarea ele 
    //so when we have this current instance we will use it to focus and design
    const textAreRef=useRef<HTMLTextAreaElement | null>(null)
    const [input,setInput]=useState<string>('')
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const sendMessage=async()=>{
        setIsLoading(true)
        try{
            await axios.post('/api/message/send',{text:input,chatId})
            setInput('')
        }catch(error:any){
            // console.log(error)
            toast.error('Something went wrong. Please try again later.')
        }finally{
            setIsLoading(false)
        }
    }
  return (
    <div className="border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-8">
        <div className='relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-indigo-600 '>
            <TextareaAutosize 
            ref={textAreRef}
            onKeyDown={(e)=>{
                if(e.key === 'Enter' && !e.shiftKey){
                    e.preventDefault()
                    sendMessage()
                }
            }}
            rows={1}
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder={`Message ${ChatPartner.name}`}
            className='block w-full resize-none border-0 bg-transparent text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:py-1.5 sm:leading-6 '
            />

            <div onClick={(e)=>textAreRef.current?.focus()} className='py-2'>
                <div className='py-px'>
                    <div className='h-9'/>
                </div>
            </div>

            <div className='absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2'>
                {/* <div className='flex shrink-0'> */}
                    <Button isLoading={isLoading} type='submit' onClick={sendMessage}>Post</Button>
                {/* </div> */}
            </div>
        </div>
    </div>
  )
}

export default ChatInp