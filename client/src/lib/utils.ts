import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//as pusher client DO NOT ALLOW UNDERSCORES (user:sessionid:incoming_friend_requests)
//so we will convert that underscore keys to another representation(/:) -> normal comma
export function toPusherKey(key:string){
  return key.replace(/:/g,'__')
}

export function chatLinkConstructr(id1:string,id2:string){
  const sortedId=[id1,id2].sort()
  return `${sortedId[0]}--${sortedId[1]}`
}