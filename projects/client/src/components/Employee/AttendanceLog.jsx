import React, {useState, useEffect} from 'react'
import { Pagination } from 'flowbite-react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import InputField from '../InputField'
import Dropdown from '../Dropdown'
import { attendanceLog } from '../../api/attendance'
import StatusLabel from '../StatusLabel'
import noData from '../../assets/No data-amico.png'

export default function AttendanceLog({successMessage, errorMessage}) {
    const [attandanceData, setAttendanceData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const token = localStorage.getItem("token")
    const [filter, setFilter] = useState(new URLSearchParams())
    const params = new URLSearchParams(window.location.search)
    const navigate = useNavigate()
    const currentDate = dayjs()

    const getAttendances = async() => {
        try{
            const response = await attendanceLog(token, params.get("page") || 1, params.get("start") || currentDate.subtract(1, "month").format("YYYY-MM-DD"), params.get("end") || currentDate.format("YYYY-MM-DD"), params.get("status") || "", params.get("sort") || "")
            if(response.data?.data){
                setAttendanceData(response.data?.data?.rows)
                setTotalPages(Math.ceil(response.data.pagination?.totalData / response.data.pagination?.perPage));
            } else {
                setAttendanceData([])
            }
        }catch(error){
            if(error.response){
                console.log(error.response.message)
            }
        }
    }

    const onPageChange = (page) => {
        setAttendanceData([])
        setCurrentPage(page)
        const newFilter = new URLSearchParams(filter.toString())
        setFilter(newFilter)
        const params = new URLSearchParams(window.location.search)
        params.set("page", page.toString())
        navigate({search: params.toString()})
    }

    const handleFilterChange = (paramName, paramValue) => {
        const newFilter = new URLSearchParams(filter.toString())
        newFilter.set("page", "1")
        if(paramName === ""){
            newFilter.delete(paramName)
        } else {
            newFilter.set(paramName, paramValue)
        }
        setFilter(newFilter)
        const params = new URLSearchParams(window.location.search)
        params.set("page", "1")
        params.set(paramName, paramValue)
        navigate({search: params.toString()})
    }

    const statusOptions = [
        {label: "Default", value: ""},
        {label: "Present", value: "Present"},
        {label: "Half Day Salary Cut", value: "Half Day Salary Cut"},
        {label: "Full Day Salary Cut", value: "Full Day Salary Cut"}
    ]

    const sortOptions = [
        {label: "Default", value: ""},
        {label: "Latest", value: "DESC"},
        {label: "Oldest", value: "ASC"}
    ]
    useEffect(() => {
        getAttendances()
    }, [successMessage, errorMessage, filter])

  return (
    <div className='flex flex-col gap-4'>
        <div className='flex w-full flex-col gap-4 justify-center items-center'>
            <div className='flex w-full gap-4 justify-center items-center'>
                <div className='w-full'>
                    <label htmlFor='start' className='font-inter text-sm text-blue-background'>From</label>
                    <InputField id={"start"} value={params.get("start") || currentDate.subtract(1, "month").format("YYYY-MM-DD")} type={"date"} onChange={(e) => handleFilterChange(e.target.id, e.target.value)}/>
                </div>
                <div className='w-full'>
                    <label htmlFor='end' className='font-inter text-sm text-blue-background'>To</label>
                    <InputField id={"end"} value={params.get("end") || currentDate.format("YYYY-MM-DD")} type={"date"} onChange={(e) => handleFilterChange(e.target.id, e.target.value)}/>
                </div>
            </div>
            <div className='flex w-full gap-4 justify-center items-center'>
                <Dropdown id={"sort"} options={sortOptions} onChange={(e) => handleFilterChange(e.target.id, e.target.value)} placeholder={"Sort By Date"}/>
                <Dropdown id={"status"} options={statusOptions} onChange={(e) => handleFilterChange(e.target.id, e.target.value)} placeholder={"Filter by Status"}/>
            </div>
        </div>
        <div className='overflow-x-auto w-full whitespace-nowrap'>
        <table className='w-full border-separate border-spacing-x-4 lg:border-spacing-x-0'>
            <thead>
                <tr className='font-inter text-blue-background'>
                    <th className="py-2" style={{width: "25%"}}>Date</th>
                    <th className="py-2" style={{width: "25%"}}>Clock In</th>
                    <th className="py-2" style={{width: "25%"}}>Clock Out</th>
                    <th className="py-2" style={{width: "25%"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {attandanceData.length !== 0 ? (attandanceData.map((data, index) => (
                    <tr key={index}>
                        <td className="py-2 text-center font-miriam" style={{width: "25%"}}>{dayjs(data.date).format("DD MMM YYYY").toUpperCase()}</td>
                        <td className="py-2 text-center font-miriam text-blue-primary" style={{width: "25%"}}>{data.clockIn ? data.clockIn : "-"}</td>
                        <td className="py-2 text-center font-miriam text-red-500" style={{width: "25%"}}>{data.clockOut ? data.clockOut : "-"}</td>
                        <td className="py-2 px-auto" style={{width: "25%"}}><StatusLabel label={data.status} /></td>
                    </tr>
                ))) : (
                    <tr>
                        <td className='py-2 font-inter' colSpan="5">
                            <div className='mx-auto flex flex-col gap-2 w-full justify-center items-center'>
                                <img src={noData} alt="Day Off" className='w-60' />
                                <span>No Attendance Available</span>
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
        </div>
        <div className='mt-10 flex justify-center'>
            <Pagination 
                currentPage={currentPage}
                onPageChange={onPageChange}
                showIcons
                layout="pagination"
                totalPages={totalPages}
                nextLabel="Next"
                previousLabel="Back"
                className="mx-auto " />
        </div>
    </div>
  )
}
