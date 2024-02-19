
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const loading = () => {
  return (
    <div className='w-full flex flex-col gap-3 mx-10'>
        <Skeleton className='mb-4 ' height={60} width={500}/>
        <Skeleton className='' height={50} width={350}/>
        <Skeleton className='' height={50} width={350}/>
        <Skeleton className='' height={50} width={350}/>
    </div>
  )
}

export default loading