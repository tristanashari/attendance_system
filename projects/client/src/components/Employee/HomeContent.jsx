import React, {useState, useEffect} from 'react'
import DateAndTime from '../DateAndTime'
import clockInPic from '../../assets/At the office-bro.png'
import clockOUtPic from '../../assets/Back to work-bro.png'
import Button from '../Button'
import { todaysLog, clockIn, clockOut } from '../../api/attendance'
import dayjs from 'dayjs'
import Alert from '../Alert'
import AttendanceLog from './AttendanceLog'
import TabMenu from './TabMenu'
import Payroll from './Payroll'

export default function HomeContent() {
    const [todaysEmployeeLog, setTodaysEmployeeLog] = useState([])
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [content, setContent] = useState(<AttendanceLog successMessage={successMessage} errorMessage={errorMessage}/>)
    const tabList = [
        { name: "Attendance Log", isActive: false, param: "attendance-log", tab: <AttendanceLog successMessage={successMessage} errorMessage={errorMessage}/> },
        { name: "Payroll", isActive: false, param: "payroll", tab: <Payroll /> }
    ]
    const token = localStorage.getItem("token")

    const clockingIn = async() => {
        try{
            const response = await clockIn(token, dayjs().format("HH:mm"))
            if(response.status === 200){
                setErrorMessage("")
                setSuccessMessage(response.data?.message)
            }
        }catch(error){
            if(error.response.status ===500){
                setErrorMessage("Failed Clocking In: Server Error")
            } else if(error.response.data?.message){
                setErrorMessage(error.response.data?.message)
            }
        }
    }

    const clockingOut = async() => {
        try{
            const response = await clockOut(token, dayjs().format("HH:mm"))
            if(response.status === 200){
                setErrorMessage("")
                setSuccessMessage(response.data?.message)
            }
        }catch(error){
            if(error.response.status ===500){
                setErrorMessage("Failed Clocking Out: Server Error")
            } else if(error.response.data?.message){
                setErrorMessage(error.response.data?.message)
            }
        }
    }

    const getTodaysLog = async() => {
        try{
            const response = await todaysLog(token)
            if(response.data){
                setTodaysEmployeeLog(response.data?.data)
            }else {
                setTodaysEmployeeLog([])
            }
        }catch(error){
            if(error.response){
                console.log(error.response.message)
            }
        }
    }

    useEffect(() => {
        getTodaysLog()
    }, [successMessage, errorMessage])
  return (
    <>
    <div className='w-full flex flex-col gap-4 mb-10'>
        <div className='w-full lg:flex-row lg:gap-4 flex flex-col gap-2'>
            <DateAndTime />
            <div className='w-full rounded-md lg:h-40 h-auto bg-blue-secondary grid lg:grid-cols-4 grid-rows-2 lg:grid-rows-none'>
                <div className='lg:h-full lg:flex lg:justify-center lg:items-center lg:col-span-1 hidden'>
                    <img src={todaysEmployeeLog.status === "Half Day Salary Cut" ? clockInPic : clockOUtPic} alt="Add Employee" className='h-40'/>
                </div>
                <div className='h-full flex flex-col justify-start items-start lg:col-span-2 row-span-1 px-4 lg:px-0'>
                    <span className='font-inter text-lg text-blue-background my-4'>Today's Log</span>
                    <span className='font-miriam'>{todaysEmployeeLog.clockIn ? <span>You have clocked in at <span className='font-bold text-blue-background'>{todaysEmployeeLog.clockIn}</span></span> : "You haven't clocked in"}</span>
                    <span className='font-miriam'>{todaysEmployeeLog.clockOut ? <span>You have clocked out at <span className='font-bold text-red-600'>{todaysEmployeeLog.clockOut}</span></span> : "You haven't clocked out"}</span>
                </div>
                <div className='w-full flex flex-col justify-center items-center gap-2 lg:col-span-1 row-span-1 px-4'>
                    <Button type={"submit"} onClick={clockingIn} label={"Clock In"} condition={"primary"} isDisabled={todaysEmployeeLog.clockIn || todaysEmployeeLog.status === "Present" || dayjs().isAfter(dayjs().set('hour', 17).set('minute', 0))}/>
                    <Button type={"submit"} onClick={clockingOut} label={"Clock Out"} condition={"danger"} isDisabled={!todaysEmployeeLog.clockIn || todaysEmployeeLog.status === "Present" || dayjs().isAfter(dayjs().set('hour', 17).set('minute', 0))}/>
                </div>
            </div>
        </div>
        <Alert successMessage={successMessage} errorMessage={errorMessage} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
    </div>
    <TabMenu tabContent={tabList} setContent={setContent}/>
    <div>
        {content}
    </div>
    </>
  )
}
