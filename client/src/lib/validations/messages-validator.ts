import { z } from "zod";


//for a single message validation
export const messageSchema=z.object({
    id:z.string(),
    senderId:z.string(),
    receiverId:z.string(),
    text:z.string(),
    timestamp:z.number()
})

// for an array of message validation
export const messageArraySchema=z.array(messageSchema)
//its just a same schema in db.d.ts but it is a more of validated schema 
//means the Message will contain the validated message but in that same Message schema in db.d.ts
export type Message=z.infer<typeof messageSchema>

