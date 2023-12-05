import React from 'react'

export default function InputField({
    id,
    value,
    type,
    placeholder,
    onChange,
    onBlur
}) {
  return (
    <input value={value} id={id} type={type} placeholder={placeholder} onChange={onChange} onBlur={onBlur} className='w-full bg-gray-light rounded-md font-inter h-10 px-2 border-blue-secondary'/>
  )
}
