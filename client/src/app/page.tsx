import { db } from '@/src/lib/db'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default async function Home() {
    redirect('/login')
  return (
    <div className='text-red-500 text-5xl'>
      
    </div>
    )
}
