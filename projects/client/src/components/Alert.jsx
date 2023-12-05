import React, { useEffect, useState } from 'react'
import { HiX } from 'react-icons/hi'

export default function Alert({successMessage, errorMessage, setSuccessMessage, setErrorMessage}) {
    const [showAlert, setShowAlert] = useState(false)

    useEffect(() => {
        if(successMessage || errorMessage){
            setShowAlert(true)
            const timeout = setTimeout(() => {
                setShowAlert(false)
                setSuccessMessage("")
                setErrorMessage("")
            }, 4000)

            return () => {
                clearTimeout(timeout)
            }
        }
    }, [successMessage, errorMessage])

    const handleClose = () => {
        setShowAlert(false)
    }
  return (
    showAlert ? (
        <div className={`${successMessage ? "bg-green-100" : "bg-red-100"} flex gap-2 w-full p-2 rounded-md items-center justify-between`}>
            <div className={`${successMessage ? "text-green-600" : "text-red-600"} text-sm font-inter flex`}>
            {successMessage ? successMessage : errorMessage}
            </div>
            <HiX className={`${successMessage ? "text-green-600" : "text-red-600"} h-6 w-6 cursor-pointer`} onClick={handleClose} />
        </div>
    ) : null
  )
}
