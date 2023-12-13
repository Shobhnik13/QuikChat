import React from 'react'
import { Toaster } from 'react-hot-toast'

const ToastProvider = () => {
  return (
    <div>
        <Toaster
        position="top-center"
        reverseOrder={false}
        />
    </div>
  )
}

export default ToastProvider