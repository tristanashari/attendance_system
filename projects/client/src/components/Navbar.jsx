import React from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarLogo from '../assets/AttendeeNavWhite.png'
import Button from './Button'
import {BiLogOut} from 'react-icons/bi'

export default function Navbar() {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }
  return (
    <div className='w-full h-20 flex justify-center bg-blue-background'>
        <div className='w-10/12 flex items-center justify-between'>
            <img src={NavbarLogo} alt="Attendee" />
            <div className='lg:w-32 lg:block hidden'>
                <Button condition={"secondary-icon-text"} label={"Log Out"} icon={<BiLogOut className='w-6 h-6 text-blue-background'/>} onClick={handleLogout}/>
            </div>
            <div className='lg:hidden'>
                <Button condition={"secondary"} icon={<BiLogOut className='w-6 h-6 text-blue-background'/>} onClick={handleLogout}/>
            </div>
        </div>
    </div>
  )
}
