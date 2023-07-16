import React, {useState, useEffect} from 'react'
import { NavbarEmployee } from '../subComponents/HomeEmployee/NavbarEmployee'
import clockOutPic from "../../assets/Back to work-bro.png"
import clockInPic from "../../assets/At the office-bro.png"
import dayjs from "dayjs"
import axios from '../../api/axios'
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const HomeEmployee = () => {
    const currentDate = dayjs().format("DD MMM YYYY")
    const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
    const [clockIn, setClockIn] = useState(false)
    const [clockOut, setClockOut] = useState(true)
    const [attendanceState, setAttendanceState] = useState("You haven't clocked in for today")
    const [picture, setPicture] = useState(clockOutPic)
    const authToken = localStorage.getItem("token")

    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentTime(dayjs().format('HH:mm'));
        }, 1000);
    
        return () => clearInterval(interval);
      }, []);

    const handleClockIn = async() => {
        if(!clockIn){
        setClockIn(true)
        setClockOut(false)
        setPicture(clockInPic)
        await axios.post(`/attendance-clockin?clockIn=${dayjs().format("HH:mm")}`, {}, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          })
        setAttendanceState(`You have clocked in at ${dayjs().format("HH:mm")}`)
        }}
    const handleClockOut = async() => {
        if(!clockOut){
        setClockOut(true)
        setPicture(clockOutPic)
        await axios.post(`/attendance-clockout?clockOut=${dayjs().format("HH:mm")}`, {}, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
        })
        setAttendanceState(`You have clocked out at ${dayjs().format("HH:mm")}`)
    }}
  return (
    <>
    <NavbarEmployee />
    <div className="grid grid-rows-2 lg:grid lg:grid-rows-1 lg:grid-cols-4 w-72 lg:w-9/12 mx-auto h-24 lg:h-40 my-6 lg:mt-16">
        <div className="row-span-1 lg:col-span-1 flex justify-between items-center px-2 lg:flex lg:flex-col lg:justify-center lg:bg-blue-background lg:text-white lg:rounded-md">
            <div className="font-miriam font-bold text-lg">{currentDate.toUpperCase()}</div>
            <div className="font-miriam font-bold text-lg lg:text-4xl">{currentTime}</div>
        </div>
        <div className="row-span 1 lg:col-span-3 px-2 flex justify-center items-center">
            <div className="lg:hidden flex flex-col w-full">
            <div className="text-lg font-inter lg:hidden w-full">Your Shift</div>
            <div className="flex justify-between lg:hidden w-full">
                <div className="font-inter">Mon-Fri</div>
                <div className="font-inter text-blue-background">09:00-17:00</div>
            </div>
            </div>
            <div className="hidden lg:grid lg:grid-cols-4 lg:h-full lg:w-full">
                <div className="hidden lg:block lg:col-span-1 lg:flex lg:justify-center lg:items-center">
                    <img src={picture} alt="send email pic" className="h-36 w-36" />
                </div>
                <div className="hidden lg:block lg:col-span-2 lg:flex lg:flex-col lg:gap-1 justify-center">
                    <div className="font-miriam font-bold text-black text-center">{attendanceState}</div>
                </div>
                <div className="hidden lg:block lg:col-span-1 lg:flex lg:flex-col gap-2 lg:justify-center lg:px-2">
                <button className={`h-10 rounded-md font-inter drop-shadow-md ${clockIn ? "bg-gray-disabled text-gray-disabled-text" : "bg-blue-600 text-white"}`} onClick={handleClockIn}>Clock In</button>
                <button className={`h-10 rounded-md font-inter drop-shadow-md ${clockOut ? "bg-gray-disabled text-gray-disabled-text" : "bg-red-600 text-white"}`} onClick={handleClockOut}>Clock Out</button>
                </div>
            </div>
        </div>
    </div>
    <div className="w-full lg:hidden h-10 flex justify-center items-center drop-shadow-md bg-white">
        <div className="w-72 flex justify-between px-2">
            <div className="w-full font-inter text-md">Attendance Log</div>
            <div><ChevronRightIcon className="h-6 w-6"/></div>
        </div>
    </div>
    <div className="flex flex-col lg:hidden w-full justify-center bg-white mt-8">
        <div className="font-miriam font-bold flex justify-center">{attendanceState}</div>
        <div className="w-full h-72 bg-white flex justify-center">
            <img src={picture} alt="Clock Out Pic" className="w-72 h-72"/>
        </div>
        <div className="flex justify-center gap-2">
        <button className={`h-10 rounded-md font-inter drop-shadow-md w-32 ${clockIn ? "bg-gray-disabled text-gray-disabled-text" : "bg-blue-600 text-white"}`} onClick={handleClockIn}>Clock In</button>
        <button className={`h-10 rounded-md font-inter drop-shadow-md w-32 ${clockOut ? "bg-gray-disabled text-gray-disabled-text" : "bg-red-600 text-white"}`} onClick={handleClockOut}>Clock Out</button>
        </div>
    </div>
    </>
  )
}
