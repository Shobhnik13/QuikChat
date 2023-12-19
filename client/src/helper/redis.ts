const upstashRedisUrl=process.env.UPSTASH_REDIS_REST_URL
const upstashRedisToken=process.env.UPSTASH_REDIS_REST_TOKEN

type Command='zrange' | 'get' | 'sismember' | 'smembers'
export async function fetchRedis(command:Command,...args:(string | number)[]) {
    const commandUrl=`${upstashRedisUrl}/${command}/${args.join('/')}`

    const restResponse=await fetch(commandUrl,{
        headers:{
            Authorization:`Bearer ${upstashRedisToken}`
        },
    cache:'no-store',
    })
    
    if(!restResponse.ok){
        throw new Error(`Error executing redis commands:${restResponse.statusText}`)
    }

    const data=await restResponse.json()
    return data.result
}