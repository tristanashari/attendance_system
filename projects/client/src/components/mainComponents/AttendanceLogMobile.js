import React, {useState, useEffect} from 'react'
import axios from "../../api/axios"
import dayjs from 'dayjs'
import { Pagination } from "flowbite-react";
import { NavbarEmployee } from '../subComponents/HomeEmployee/NavbarEmployee';

export const AttendanceLogMobile = () => {
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
    <NavbarEmployee />
    <div className="w-full h-auto flex items-center justify-center mt-4">
        <div className="w-72 h-auto bg-white grid grid-rows-5 gap-2">
            <div className="bg-white row-span-1 flex justify-start font-inter items-center text-lg font-bold">Attendance Log</div>
            <div className="bg-white row-span-1 flex justify-center font-inter items-center">
                <div className="w-14">From</div>
                <input type="date" onChange={(e) => setStartDate(e.target.value)} value={startDate} className="w-full"/>
            </div>
            <div className="row-span-1 flex justify-center font-inter items-center">
                <div className="w-14">To</div>
                <input type="date" onChange={(e) => setEndDate(e.target.value)} value={endDate} className="w-full"/>
            </div>
            <div className="bg-white row-span-1 flex justify-center font-inter items-center">
                <select className="w-full" onChange={(e) => handleStatus(e.target.value)}>
                    <option value="">--Filter by Status--</option>
                    <option value="Present">Present</option>
                    <option value="Half Day Salary Cut">Half Day Salary Cut</option>
                    <option value="Full Day Salary Cut">Full Day Salary Cut</option>
                </select>
            </div>
            <div className="bg-white row-span-1 flex justify-center font-inter items-center">
                <select className="w-full" onChange={(e) => handleOrder(e.target.value)}>
                    <option value="desc">--Order by--</option>
                    <option value="desc">Latest</option>
                    <option value="asc">Oldest</option>
                </select>
            </div>
        </div>
    </div>
    <div className="w-full h-auto flex flex-col items-center justify-center mt-10">
        <div className="w-full h-10 bg-white drop-shadow-md grid grid-cols-3">
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Date</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Clock In</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Clock Out</div>
        </div>
        {attendanceLog.data?.map((data) => (
            <div className="w-72 h-10 bg-white grid grid-cols-3">
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center">{dayjs(data.date).format("DD MMM YYYY").toUpperCase()}</div>
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-blue-600">{data.clockIn}</div>
            <div className="bg-white col-span-1 flex justify-center font-miriam items-center text-red-600">{data.clockOut}</div>
        </div>
        ))}
        <div className="w-72 flex justify-center items-center my-20">
        <Pagination className="flex w-40"
          currentPage={currentPage}
          onPageChange={handlePage}
          totalPages={totalPage}
        />
        </div>
    </div>    
    </>
  )
}
