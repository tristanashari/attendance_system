import React, { useState, useEffect } from 'react'
import { NavbarAdmin } from '../subComponents/HomeAdmin/NavbarAdmin'
import { HeaderAdmin } from '../subComponents/HomeAdmin/HeaderAdmin'
import axios from "../../api/axios"
import dayjs from "dayjs"
import { ChevronRightIcon } from '@heroicons/react/24/outline'

export const HomeAdmin = () => {
    const [employeeData, setEmployeeData] = useState([])
    useEffect(() => {
        axios.get("/employee").then((response) => {setEmployeeData(response.data)}).catch((error) => {console.log(error)})
    }, [])
  return (
    <>
    <NavbarAdmin />
    <HeaderAdmin />
    <div className="hidden lg:w-full lg:h-auto lg:flex lg:flex-col lg:items-center lg:justify-center mt-10 mb-40">
        <div className="mb-4 font-inter text-lg w-9/12">Employees</div>
        <div className="w-9/12 h-10 bg-white drop-shadow-md grid grid-cols-4">
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Full Name</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Email</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Date of Birth</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">Join Date</div>
        </div>
        {employeeData.data?.map((data) => (
        <div className="w-9/12 h-10 bg-white grid grid-cols-4">
            <div className="bg-white col-span-1 flex justify-center font-inter items-center">{data.fullName}</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center text-blue-background">{data.email}</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center text-blue-600">{(data.dateOfBirth === null) ? "" : dayjs(data.dateOfBirth).format("DD-MMM-YYYY")}</div>
            <div className="bg-white col-span-1 flex justify-center font-inter items-center text-red-600">{(data.joinDate === null) ? "" : dayjs(data.joinDate).format("DD-MMM-YYYY")}</div>
        </div>
        ))}
    </div>
    <div className="w-full h-auto flex flex-col items-center justify-center mt-10 lg:hidden">
        <div className="w-72 h-10 bg-white drop-shadow-md flex items-center">
            <div className="bg-white flex justify-start font-inter items-center px-2">Employees</div>
        </div>
        {employeeData.data?.map((data) => (
        <div className="w-72 h-10 bg-white flex justify-between items-center">
            <div className="bg-white flex justify-start font-inter items-center">{data.fullName ? data.fullName : data.email}</div>
            <div><ChevronRightIcon className="w-6 h-6"/></div>
        </div>
        ))}
    </div>
    </>
  )
}
