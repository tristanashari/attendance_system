import React, {useState,useEffect} from 'react'
import axios from "../../../api/axios"
import dayjs from 'dayjs'
import toRupiah from "@develoka/angka-rupiah-js";

export const PayrollEmployee = () => {
    const [attendanceLog, setAttendanceLog] = useState([])
    const [salary, setSalary] = useState([])
    const authToken = localStorage.getItem("token")

    useEffect(() => {
        axios.get("/one-year-attendance", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }).then((response) => {setAttendanceLog(response.data)}).catch((error) => {console.log(error)})
    }, [authToken])

    useEffect(() => {
        axios.get("/salary", {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }).then((response) => {setSalary(response.data?.data?.salary)}).catch((error) => {console.log(error)})
    }, [authToken])

    const uniqueMonthsAndYears = [
        ...new Set(attendanceLog.data?.map((data) => dayjs(data?.date).format("MMMM YYYY")))
      ];
  return (
    <>
    <div className="w-full h-auto flex items-center justify-center mt-20">
        <div className="w-9/12 h-10 bg-white">
            <div className="bg-white flex justify-start font-inter items-center text-lg font-bold">Payroll</div>
        </div>
    </div>
    <div className="w-full h-auto flex items-center justify-center mt-4">
        <div className="w-9/12 h-10 bg-white flex gap-2">
            <div className="font-inter">Per Month Salary:</div>
            <div className="font-inter text-blue-background">{toRupiah(salary)}</div>
        </div>
    </div>
    <div className="w-full h-auto flex items-center justify-center">
        <div className="w-9/12 h-10 bg-white flex gap-2">
            <div className="font-miriam">Payroll list are displayed per month dating back from last year</div>
        </div>
    </div>
    <div className="w-full h-auto flex flex-col items-center justify-center mt-4">
        <div className="w-9/12 h-10 bg-white drop-shadow-md grid grid-cols-3">
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Month</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Payroll</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Deduction</div>
        </div>
        {uniqueMonthsAndYears.map((month) => {
            let totalDeduction = 0
            let halfDayDeduction = salary / 21 / 2
            let fullDayDeduction = salary / 21
            let totalSalary = 0
            attendanceLog.data?.map((data) => {
                if (dayjs(data?.date).format("MMMM YYYY") === month) {
                    if (data?.status === "Half Day Salary Cut") {
                        totalDeduction += halfDayDeduction
                    } else if (data?.status === "Full Day Salary Cut") {
                        totalDeduction += fullDayDeduction
                    }
                }
                return null
            })
            totalSalary = salary - totalDeduction;
            return (
                <div className="w-9/12 h-10 bg-white drop-shadow-md grid grid-cols-3">
                    <div className="bg-white col-span-1 flex justify-center font-miriam items-center">{month}</div>
                    <div className="bg-white col-span-1 flex justify-center font-miriam items-center">{toRupiah(Math.ceil(totalSalary))}</div>
                    <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-red-600">{toRupiah(Math.floor(totalDeduction))}</div>
                </div>
            );
        })}
    </div>    
    </>
  )
}
