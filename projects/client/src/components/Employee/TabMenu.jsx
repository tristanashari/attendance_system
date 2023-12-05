import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function TabMenu({tabContent, setContent}) {
    const location = useLocation()
    const navigate = useNavigate()
    const queryParam = new URLSearchParams(location.search)
    const activeTabParam = queryParam.get('tab')

    const activeTab = tabContent.find(tab => tab.param === activeTabParam) || tabContent[0]

    const handleTabClick = (tabId, tabContent) => {
        const newParam = new URLSearchParams()
        newParam.set("tab", tabId)
        navigate({ search: newParam.toString() })

        setContent(tabContent)
    }
  return (
    <div className='mb-6'>
        <ul className='flex w-full' role='tablist'>
            {tabContent.map((data) => (
                <li key={data.name} className='w-full flex justify-center items-center'>
                    <button className={`w-full h-12 text-xl font-inter ${activeTab.param === data.param
                  ? "text-blue-background border-b border-gold"
                  : "text-gray-disabled"
                  }`} id={`${data.name}-tab`} type='button' onClick={() => {handleTabClick(data.param, data.tab)}}>
                        <span>{data.name}</span>
                    </button>
                </li>
            ))}
        </ul>
    </div>
  )
}
