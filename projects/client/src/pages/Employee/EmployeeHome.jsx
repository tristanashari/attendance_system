import React from 'react'
import Navbar from '../../components/Navbar'
import HomeContent from '../../components/Employee/HomeContent'

export default function EmployeeHome() {
  return (
    <div className='flex flex-col items-center'>
        <Navbar />
        <div className='m-10 lg:w-8/12 w-11/12'>
          <HomeContent />
        </div>
    </div>
  )
}
