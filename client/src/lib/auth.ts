import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import { db } from "./db";
import GoogleProvider from 'next-auth/providers/google'

// exporting google credentials 
function getGoogleCreds(){
    const clientId='900551127322-s4fniccsbs9r741k1conn0814aj0djtv.apps.googleusercontent.com'
    const clientSecret='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'

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
        strategy:"jwt",
        maxAge:60*60*24*30
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

    // callbacks
    callbacks:{
        async jwt({ token, user }) {
        //if there is a user already in the db
        // so we will first get the user from db by db.get(`user:${token.id}`)
        // this id is coming from the id that our redis upstash adapter has set while updating user to db
        
        
        const dbUser=await (db.get(`user:${token.id}`)) as User | null
        
        // if user doesnt exist in db 
        if(!dbUser){
            token.id=user!.id
            return token
        }
        //if there is a user then return user 
        return{
            id:dbUser.id,
            name:dbUser.name,
            email:dbUser.email,
            picture:dbUser.image
        }    
    },
        async session({ session, token, user }) {
            // Send properties to the client/frontend, like an access_token and user id from a provider.
            if(token){
                session.user.id=token.id,
                session.user.name=token.name,
                session.user.image=token.picture,
                session.user.email=token.email
            }
            return session
          },
        //   whenever the user successfully signed in
        // we need to redirect them 
        redirect(){
            return 'http://quik-chat-nine.vercel.app/dashboard'
        }
    },
    secret:'5TM/lGhe9/zDHkz4vOqp0nOBYamTF3uW5/4APS9KspE=', 
}







