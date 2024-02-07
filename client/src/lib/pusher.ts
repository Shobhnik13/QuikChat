import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

export const pusherServer= new PusherServer({
    appId:'1751919',
    key:'fc9efe00de7d6a66332f',
    secret:'8ab8223ad842efdf8294',
    cluster:"ap2",
    useTLS:true,
})

export const pusherClient= new PusherClient(
    process.env.PUSHER_KEY!,{
        cluster:"ap2"
    }
)