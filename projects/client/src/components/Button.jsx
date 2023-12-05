import React from 'react'

export default function Button({
    type,
    label,
    condition,
    onClick,
    isDisabled,
    icon
}) {
    let mainButtonClass, iconClass, disabledStyle ;

    disabledStyle = isDisabled ? "bg-[#A9A9A9] text-[#535353] rounded-md p-2 w-full" : "" ;

    switch(condition) {
        case "primary":
            mainButtonClass = "w-full bg-[#1870F4] text-white rounded-md shadow-md p-2 font-inter";
            break;
        case "secondary":
            mainButtonClass = "w-full bg-[#E7ECF6] text-[#232E65] p-2 rounded-md shadow-md font-inter";
            break;
        case "danger":
            mainButtonClass = "w-full bg-[#DC2626] text-white rounded-md shadow-md p-2 font-inter";
            break;
        case "primary-icon-text":
            mainButtonClass = "w-full bg-[#1870F4] text-white rounded-md shadow-md p-2 flex justify-center items-center gap-2 font-inter";
            break;
        case "secondary-icon-text":
            mainButtonClass = "w-full bg-[#E7ECF6] text-[#232E65] p-2 rounded-md shadow-md flex justify-center items-center gap-2 font-inter";
            break;
        case "icon-only":
            mainButtonClass = "w-10 h-10 bg-[#F5F5F5] rounded-md p-2"
            break;
        default:
            mainButtonClass = "w-full bg-white p-2 rounded-md shadow-md font-inter";
            break;
    }
  return (
    <button type={type} disabled={isDisabled} onClick={onClick} className={isDisabled ? disabledStyle : mainButtonClass}>
        {icon && label? 
            <><div>{icon}</div><div>{label}</div></> : label ? label : icon}
    </button>
  )
}

