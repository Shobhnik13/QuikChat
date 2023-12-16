import { authOptions } from '@/src/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

const Page = async() => {
  const sesion=await getServerSession(authOptions) 
  return (
    <div>
      dashboard
    </div>
  )
}

export default Page