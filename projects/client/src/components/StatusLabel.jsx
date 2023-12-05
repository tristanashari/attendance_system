import React from 'react'

export default function StatusLabel({label}) {
    let mainClass ;

    switch(label){
        case "Present":
            mainClass = "px-3 text-sm font-inter bg-green-100 text-green-600 w-fit rounded-full mx-auto";
            break;
        case "Full Day Salary Cut":
            mainClass = "px-3 text-sm font-inter bg-red-100 text-red-600 w-fit rounded-full mx-auto";
            break;
        case "Half Day Salary Cut":
            mainClass = "px-3 text-sm font-inter bg-yellow-100 text-yellow-600 w-fit rounded-full mx-auto"
    }
  return (
    <div className={mainClass}>{label}</div>
  )
}
