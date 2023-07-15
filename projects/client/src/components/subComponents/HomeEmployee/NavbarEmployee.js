import React from 'react'
import { useState } from 'react';
import logoNavbar from "../../../assets/AttendeeNav.png"
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

export const NavbarEmployee = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    };
  
    return (
      <nav className="bg-white p-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img src={logoNavbar} alt="Attendee Logo"/>
            </div>
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-black p-2 focus:outline-none"
              >
                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
              </button>
            </div>
            <div className={`lg:flex ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
              <ul className="lg:flex space-x-4">
                <li>
                  <a href="/employee" className="text-black font-inter hover:text-gray-200">
                    Home
                  </a>
                </li>
                <li>
                  <a href="/payroll" className="text-black font-inter hover:text-gray-200">
                    Payroll
                  </a>
                </li>
                <li>
                  <a href="/profile" className="text-black font-inter hover:text-gray-200">
                    Profile
                  </a>
                </li>
                <li>
                  <a href="/" className="text-red-600 font-inter hover:text-gray-200">
                    Log Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
}
