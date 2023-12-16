'use client'

import Button from "./ui/button"


interface AddFriendButtonProps{

}


const AddFriendButton = ({}:AddFriendButtonProps) => {
  return (
    <form className="max-w-sm" action="">
    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        Add friend by E-mail
    </label>

    <div className="mt-2 flex gap-4 items-center justify-center">
        <input type="text" placeholder="you@example.com" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
        <Button className="rounded-xl">Add</Button>
    </div>

</form>
  )
}

export default AddFriendButton