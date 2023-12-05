import React, {useState, useEffect} from 'react'
import dayjs from 'dayjs'

export default function DateAndTime() {
    const currentDate = dayjs().format("DD MMM YYYY")
    const [currentTime, setCurrentTime] = useState(dayjs().format("HH:mm"))

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs().format("HH:mm"))
        }, 1000)

        return () => clearInterval(interval)
    })
  return (
    <div className='lg:h-40 h-auto lg:w-48 w-full flex justify-between lg:flex-col lg:gap-2 bg-blue-background rounded-md lg:p-4 py-2 px-4'>
        <div className='font-inter flex justify-center text-lg items-center text-white'>
            {currentDate}
        </div>
        <div className='h-full font-miriam flex justify-center items-center lg:text-4xl text-2xl text-white'>
            {currentTime}
        </div>
    </div>
  )
}
