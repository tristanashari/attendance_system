import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import { BsSortAlphaDown, BsSortAlphaDownAlt } from 'react-icons/bs'
import { Pagination } from 'flowbite-react'
import SearchBar from '../SearchBar'
import Dropdown from '../Dropdown'
import Button from '../Button'
import { todaysAttendance } from '../../api/attendance'
import StatusLabel from '../StatusLabel'
import noData from '../../assets/No data-amico.png'

export default function AttendanceLog() {
    const [attandanceData, setAttendanceData] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const options = [
        {label: "Default", value: ""},
        {label: "Present", value: "Present"},
        {label: "Half Day Salary Cut", value: "Half Day Salary Cut"},
        {label: "Full Day Salary Cut", value: "Full Day Salary Cut"}
    ]
    const token = localStorage.getItem("token")
    const [filter, setFilter] = useState(new URLSearchParams())
    const params = new URLSearchParams(window.location.search)
    const navigate = useNavigate()

    const getTodaysAttendance = async() => {
        try{
            const response = await todaysAttendance(token, params.get("page") || 1, params.get("search") || "", params.get("status") || "", params.get("sort") || "")
            if(response.data?.data){
                setAttendanceData(response.data?.data?.rows)
                setTotalPages(Math.ceil(response.data.pagination?.totalData / response.data.pagination?.perPage));
            } else {
                setAttendanceData([])
            }
        } catch(error){
            if(error.response){
                console.log(error)
            }
        }
    }

    useEffect(() => {
        getTodaysAttendance()
    }, [filter])

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

    const sortValue = () => {
        const params = new URLSearchParams(window.location.search)
        if (params.get("sort") === "ASC" || !params.get("sort")) {
            return "DESC"
        } else {
            return "ASC"
        }
    }

    const sortIcon = () => {
        const params = new URLSearchParams(window.location.search)
        if(params.get("sort") === "ASC" || !params.get("sort")){
            return <BsSortAlphaDown className='h-6 w-6 text-blue-background' />
        } else {
            return <BsSortAlphaDownAlt className='h-6 w-6 text-blue-background' />
        }
    }

  return (
    <div className='flex flex-col gap-4'>
        <div className='font-inter text-2xl'>
            Today's Attendance
        </div>
        <div className='flex flex-col gap-2 lg:flex-row lg:gap-4 justify-center items-center w-full'>
            <div className='w-full'>
            <SearchBar id={"search"} value={params.get("search") || ""} onSubmit={(searchValue) => handleFilterChange("search", searchValue)} placeholder={"Search Employee"}/>
            </div>
            <div className='w-full flex lg:gap-4 gap-2'>
                <Dropdown id={"status"} onChange={(e) => handleFilterChange(e.target.id, e.target.value)} options={options} placeholder={"Filter by Status"}/>
                <Button condition={"icon-only"} icon={sortIcon()} onClick={() => handleFilterChange("sort", sortValue())}/>
            </div>
        </div>
        <div className='w-full overflow-x-auto whitespace-nowrap'>
        <table className='w-full border-separate border-spacing-x-4 lg:border-spacing-x-0'>
            <thead>
                <tr className='font-inter text-blue-background'>
                    <th className="py-2" style={{width: "20%"}}>Name</th>
                    <th className="py-2" style={{width: "20%"}}>Email</th>
                    <th className="py-2" style={{width: "20%"}}>Clock In</th>
                    <th className="py-2" style={{width: "20%"}}>Clock Out</th>
                    <th className="py-2" style={{width: "20%"}}>Status</th>
                </tr>
            </thead>
            <tbody>
                {attandanceData.length !== 0 ? (attandanceData.map((data, index) => (
                    <tr key={index}>
                        <td className="py-2" style={{width: "20%"}}>{data.fullName ? data.fullName : ""}</td>
                        <td className="py-2" style={{width: "20%"}}>{data.email}</td>
                        <td className="py-2 text-center font-miriam text-blue-primary" style={{width: "20%"}}>{data.Attendances[0].clockIn ? data.Attendances[0].clockIn : "-"}</td>
                        <td className="py-2 text-center font-miriam text-red-500" style={{width: "20%"}}>{data.Attendances[0].clockOut ? data.Attendances[0].clockOut : "-"}</td>
                        <td className="py-2 px-auto" style={{width: "20%"}}><StatusLabel label={data.Attendances[0].status} /></td>
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
        <div className='mb-20 mt-10 flex justify-center'>
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
