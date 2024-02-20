'use client'

import { useState } from "react"
import { addFriendSchema } from "../lib/validations/add-friend"
import Button from "./ui/button"
import axios, { AxiosError } from 'axios'
import {z} from 'zod'
import {useForm} from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "./ui/form"
import { Input } from "./ui/input"

interface AddFriendButtonProps{}


const AddFriendButton = ({}:AddFriendButtonProps) => {
    const [successRate,setSuccessRate]=useState<boolean>(false)
    
    const form=useForm<z.infer<typeof addFriendSchema>>({
        resolver: zodResolver(addFriendSchema)
    })

    const {register,setError,handleSubmit,formState:{isLoading,errors}} = useForm<z.infer<typeof addFriendSchema>>({
        resolver: zodResolver(addFriendSchema)
    })
    
      
      
      //logic function for add friend
      const addFriend=async(email:string)=>{
          try{
              //validating the email coming from input according to the addFriendSchema
  
              const validatedEmail=addFriendSchema.parse({email})
              // console.log(validatedEmail);
              
              //now making a post request to the api route by provinding the email:validatedEmail to the route
              await axios.post('/api/friends/add',{
                  email:validatedEmail,
              })
  
              // //if it is a success then updating state
              setSuccessRate(true)
          }catch(error:any){
              // console.log(error.message);
              if(error instanceof z.ZodError){
                  setError('email',{message:error.message})
                  return
              }
  
              if(error instanceof AxiosError){
                  setError('email',{message:error.response?.data})
                  return
              }
              //if the catch doesnt got caught in zod type zoderror
              //or the axios type axioserror
              //then there must be something else 
              //no need to set success rate coz we need only error
              setError('email',{message:'Something went wrong'})
          }
        }

        //onsubmit function
      const onSubmit=async(values:z.infer<typeof addFriendSchema>)=>{
        // console.log(values.email);
        
        addFriend(values.email)
      }
  return (
        <div>
            <Form {...form}>
                <form className="max-w-sm" onSubmit={form.handleSubmit(onSubmit)}>
                <label
                htmlFor='email'
                className='block text-sm font-medium leading-6 text-gray-900'>
                    Add friend by E-Mail
                </label>
                <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <div className="mt-2 flex gap-4 items-center justify-center">
                        <FormControl >
                          <Input  placeholder="you@example.com" disabled={isLoading}  {...field} />
                        </FormControl>
                          <Button type="submit" className="rounded-xl" disabled={isLoading}>Add</Button>
                    </div>
                  </FormItem>
                )}/>
                {/* for displaying errors  */}
                <p className="mt-1 text-sm text-red-600">{errors.email?.message}</p>
                {/* ONLY IF user enters successfully */}
                {successRate ? (
                    <p className="mt-1 text-sm text-green-600">Friend request sent successfully!</p>
                ):(null)}
                </form>
            </Form>
        </div>
  )
}

export default AddFriendButton