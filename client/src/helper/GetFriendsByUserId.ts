import { fetchRedis } from "./redis"

export const getFriendsByUserId=async(userId:string)=>{
    //retreive friends for the user to display in layout.tsx sidebar part
    const friendIds=await fetchRedis('smembers',`user:${userId}:friends`) as string[]
    const friends= await Promise.all(
        friendIds.map(async(item)=>{
            //here the friend will NOT be a user instead be a string boz we are senfing a get requestt
            const friend=await fetchRedis('get',`user:${item}`) as string
            const parsedFriend=JSON.parse(friend) as User
            return parsedFriend
        })
    )
    return friends
}