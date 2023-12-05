import React from 'react'
import Navbar from '../../components/Navbar'
import CreateEmployee from '../../components/Admin/CreateEmployee'
import AttendanceLog from '../../components/Admin/AttendanceLog'

export default function AdminHome() {
  return (
    <div className='flex flex-col items-center'>
        <Navbar />
        <div className='m-10 lg:w-8/12 w-11/12'>
          <CreateEmployee />
        </div>
        <div className='lg:w-8/12 w-11/12'>
          <AttendanceLog />
        </div>
    </div>
  )
}
