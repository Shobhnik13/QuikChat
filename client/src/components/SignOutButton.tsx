'use client'

import { ButtonHTMLAttributes, FC, useState } from "react"
import Button from "./ui/button"
import { signOut } from "next-auth/react"
import toast from "react-hot-toast"
import { Loader2, LogOut } from "lucide-react"
import { redirect } from "next/navigation"

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}
const SignOutButton: FC<SignOutButtonProps> = ({ ...props })=> {
    const [isSigningOut,setIsSigningOut]=useState<boolean>(false)

    const handleSignOut=async()=>{
        setIsSigningOut(true)
        try{
            await signOut();
            // redirect('/login')
        }catch(error:any){
            // console.log(error);
            toast.error('Error while signing out!')
        }finally{
            setIsSigningOut(false)
        }
    }
    return (
    <Button {...props} className="h-full aspect-square" variant={'ghost'} onClick={handleSignOut}>
        {isSigningOut?(<Loader2 className="w-4 h-4 animate-spin"/>):<LogOut className="w-4 h-4"/>}
    </Button>
  )
}

export default SignOutButton