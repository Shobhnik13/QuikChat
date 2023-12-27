import { promise } from "zod"
import { fetchRedis } from "./redis"

export const getFriendsByUserId=async(userId:string)=>{
    //retreive friends for the user to display in layout.tsx sidebar part
    const friendId=await fetchRedis('smembers',`user:${userId}:friends`) as string[]
    const friends= await Promise.all(
        friendId.map(async(item)=>{
            const friend=await fetchRedis('get',`user:${item}`) as User
            return friend
        })
    )
    return friends
}