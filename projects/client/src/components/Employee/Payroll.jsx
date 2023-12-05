import React, {useState, useEffect} from 'react'
import { oneYearAttendance } from '../../api/attendance'
import { getSalary } from '../../api/salary'
import toRupiah from '@develoka/angka-rupiah-js'
import dayjs from 'dayjs'

export default function Payroll() {
    const [attendanceData, setAttendanceData] = useState([])
    const [salaryData, setSalaryData] = useState([])
    const token = localStorage.getItem("token")

    const getOneYearAttendanceLog = async() => {
        try{
            const response = await oneYearAttendance(token)
            if(response.data){
                setAttendanceData(response.data?.data)
            } else {
                setAttendanceData([])
            }
        }catch(error){
            if(error.response){
                console.log(error.response.message)
            }
        }
    }

    const getUserSalary = async() => {
        try{
            const response = await getSalary(token)
            if(response.data){
                setSalaryData(response.data?.data?.salary)
            } else {
                setSalaryData([])
            }
        }catch(error){
            if(error.response){
                console.log(error.response.message)
            }
        }
    }

    const uniqueMonths = [
        ...new Set(attendanceData.map((data) => dayjs(data?.date).format("MMMM YYYY")))
    ]

    useEffect(() => {
        getOneYearAttendanceLog()
        getUserSalary()
    }, [])
  return (
    <div className='flex flex-col gap-4'>
        <div className='flex flex-col gap-2'>
            <span className='font-inter text-lg text-blue-background'>Monthly Salary</span> 
            <span className='font-inter'>{toRupiah(salaryData)}</span>
        </div>
        <div className='flex flex-col gap-2'>
            <span className='font-inter text-lg text-blue-background'>Twelve Month Payroll</span>
            <div className='w-full overflow-x-auto whitespace-nowrap'>
            <table className='w-full mb-10 border-separate border-spacing-x-4 lg:border-spacing-x-0'>
                <thead className='w-full'>
                    <tr className='font-inter text-blue-background'>
                        <th className='py-2' style={{width: "30%"}}>Month</th>
                        <th className='py-2' style={{width: "35%"}}>Payroll</th>
                        <th className='py-2' style={{width: "35%"}}>Deduction</th>
                    </tr>
                </thead>
                <tbody>
                {uniqueMonths.map((month, index) => {
                    let totalDeduction = 0
                    let halfDayDeduction = salaryData / 21 / 2
                    let fullDayDeduction = salaryData / 21
                    let totalSalary = 0
                    attendanceData.map((data) => {
                        if (dayjs(data?.date).format("MMMM YYYY") === month) {
                            if (data?.status === "Half Day Salary Cut") {
                                totalDeduction += halfDayDeduction
                            } else if (data?.status === "Full Day Salary Cut") {
                            totalDeduction += fullDayDeduction
                            }
                        }
                    return null
                    })
                    totalSalary = salaryData - totalDeduction;
                return (
                    <tr key={index}>
                        <td className="py-2 font-miriam text-center">{month}</td>
                        <td className="py-2 font-miriam text-center text-blue-primary">{toRupiah(Math.ceil(totalSalary))}</td>
                        <td className="py-2 font-miriam text-center text-red-600">{toRupiah(Math.floor(totalDeduction))}</td>
                    </tr>
                );
                })}
                </tbody>
            </table>
            </div>
        </div>
    </div>
  )
}
