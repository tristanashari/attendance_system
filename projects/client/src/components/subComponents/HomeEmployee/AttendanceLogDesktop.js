import React, {useState, useEffect} from 'react'
import axios from "../../../api/axios"
import dayjs from 'dayjs'
import { Pagination } from "flowbite-react";

export const AttendanceLogDesktop = () => {
    const [attendanceLog, setAttendanceLog] = useState([])
    const authToken = localStorage.getItem("token")
    const [startDate, setStartDate] = useState(() => {
        const currentDate = dayjs();
        const formattedStart = currentDate.subtract(1, "month").format("YYYY-MM-DD");
        return formattedStart;
    });
    const [endDate, setEndDate] = useState(() => {
        const currentDate = dayjs();
        const formattedEnd = currentDate.format("YYYY-MM-DD");
        return formattedEnd;
    });
    const [statusValue, setStatusValue] = useState("")
    const [orderValue, setOrderValue] = useState("desc")
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)

    useEffect(() => {
        axios.get(`/attendance?page=${currentPage}&startDate=${startDate}&endDate=${endDate}&status=${statusValue}&sortBy[date]=${orderValue}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }).then((response) => {setAttendanceLog(response.data); setTotalPage(Math.ceil(response.data.pagination?.totalData / 10))}).catch((error) => {console.log(error)})
    }, [authToken, startDate, endDate, statusValue, orderValue, currentPage])

    console.log(attendanceLog)

    const handleStatus = (value) => {
        setStatusValue(value)
    }
    const handleOrder = (value) => {
        setOrderValue(value)
    }
    function handlePage(page) {
        setCurrentPage(page);
      }
  return (
    <>
    <div className="hidden lg:w-full lg:h-auto lg:flex lg:items-center lg:justify-center mt-20">
        <div className="w-9/12 h-10 bg-white grid grid-cols-5 gap-2">
            <div className="bg-white col-span-1 flex justify-start font-inter items-center text-lg font-bold">Attendance Log</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">
                <div>From</div>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} />
            </div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">
                <div>To</div>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate}/>
            </div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">
                <select className="w-full" onChange={(e) => handleStatus(e.target.value)}>
                    <option value="">--Filter by Status--</option>
                    <option value="Present">Present</option>
                    <option value="Half Day Salary Cut">Half Day Salary Cut</option>
                    <option value="Full Day Salary Cut">Full Day Salary Cut</option>
                </select>
            </div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">
                <select className="w-full" onChange={(e) => handleOrder(e.target.value)}>
                    <option value="desc">--Order by--</option>
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>
        </div>
    </div>
    <div className="hidden lg:w-full lg:h-auto lg:flex lg:flex-col lg:items-center lg:justify-center mt-10">
        <div className="w-9/12 h-10 bg-white drop-shadow-md grid grid-cols-5">
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Date</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Shift</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Clock In</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Clock Out</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Status</div>
        </div>
        {attendanceLog.data?.map((data) => (
            <div className="w-9/12 h-10 bg-white grid grid-cols-5">
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center">{dayjs(data.date).format("DD MMM YYYY").toUpperCase()}</div>
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-blue-background">09:00-17:00</div>
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-blue-600">{data.clockIn}</div>
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-red-600">{data.clockOut}</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">{data.status}</div>
        </div>
        ))}
        <div className="hidden lg:w-9/12 lg:flex lg:justify-center lg:items-center lg:my-20">
        <Pagination className="lg:flex lg:w-40"
          currentPage={currentPage}
          onPageChange={handlePage}
          totalPages={totalPage}
        />
        </div>
    </div>    
    </>
  )
}
