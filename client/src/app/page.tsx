import { db } from '@/src/lib/db'
import Image from 'next/image'

export default async function Home() {
  await db.set('elvis-bhai','sishtam')
  
  return (
    <div className='text-red-500 text-5xl'>
      hiiiii
    </div>
    )
}
