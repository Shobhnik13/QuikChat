import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'

// exporting google credentials 
function getGoogleCreds(){
    const clientId=process.env.GOOGLE_CLIENT_ID
    const clientSecret=process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0){
        throw new Error('MISSING GOOGLE CLIENT ID!')
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error('MISSING GOOGLE CLIENT SECRET!')
    }
    return {clientId,clientSecret}
}

export const authOptions:NextAuthOptions={
    // this adapter will automatically saves the data to db
    // whenever user logs in with their email id 
    // so the redis database will updated automatically by using this next-auth/upstash-adapter
    // we dont need to worry about auth data persistence

    adapter:UpstashRedisAdapter(db),

    // we allow session of user login/logout on jwt based not on our db
    // which will further helps us to protext the routes through passing this jwt to middleware

    session:{
        strategy:'jwt'
    },

    // this will help to create the custom pages of sig-in,sign-out etc...
    // we can define that page path too
    
    pages:{
        signIn: '/login',
    },

    //auth-providers

    providers:[
        GoogleProvider({
            clientId:getGoogleCreds().clientId,
            clientSecret:getGoogleCreds().clientSecret
        })
    ],

    
}