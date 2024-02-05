import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer= new PusherServer({
    appId:process.env.PUSHER_ADD_ID!,
    key:process.env.PUSHER_KEY!,
    secret:process.env.PUSHER_SECRET!,
    cluster:"ap2",
    useTLS:true,
})

export const pusherClient= new PusherClient(
    process.env.PUSHER_KEY!,{
        cluster:"ap2"
    }
)