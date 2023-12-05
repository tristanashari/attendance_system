import React, {useState} from 'react'
import * as yup from 'yup'
import { useFormik } from 'formik'
import emailPic from '../../assets/Sent Message-bro.png'
import InputField from '../InputField'
import Button from '../Button'
import { addEmployee } from '../../api/auth'
import Alert from '../Alert'
import DateAndTime from '../DateAndTime'

export default function CreateEmployee() {
    const [successMessage, setSuccessMessage] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const token = localStorage.getItem("token")

    const onSubmit = async(values, actions) => {
        try{
            const response = await addEmployee(values, token)
            if(response.status === 200){
                actions.resetForm()
                setErrorMessage("")
                setSuccessMessage(response.data?.message)
            }
        }catch(error){
            if(error.response.status === 500){
                setErrorMessage("Add Employee Failed: Server Error")
            } else if(error.response.data?.message){
                setErrorMessage(error.response.data?.message)
            }
        }
    }

    const addEmployeeSchema = yup.object().shape({
        email: yup.string().email().required("Employee email is required"),
        salary: yup.number().required("Employee salary is required")
    })

    const {values, handleChange, handleSubmit, isSubmitting, isValid} = useFormik({
        initialValues: {
            email: "",
            salary: ""
        },
        validationSchema: addEmployeeSchema,
        onSubmit
    })
  return (
    <>
    <div className='w-full flex flex-col gap-4'>
        <div className='w-full flex lg:flex-row flex-col lg:gap-4 gap-2'>
            <DateAndTime />
            <div className='w-full rounded-md lg:h-40 h-auto bg-blue-secondary grid lg:grid-cols-4 lg:grid-rows-none grid-rows-3'>
                <div className='lg:h-full lg:flex lg:justify-center lg:items-center lg:col-span-1 hidden'>
                    <img src={emailPic} alt="Add Employee" className='h-40'/>
                </div>
                <div className='h-full flex flex-col justify-start items-start lg:col-span-1 row-span-1 px-4 lg:px-0'>
                    <span className='font-inter text-lg text-blue-background my-4'>Register An Employee</span>
                    <span className='font-miriam'>Enter employee email and set the salary</span>
                </div>
                <form onSubmit={handleSubmit} autoComplete="off" className='w-full flex flex-col justify-center items-center gap-2 lg:col-span-2 px-4 mb-4 row-span-2 lg:mb-0'>
                    <InputField id={"email"} placeholder={"Email"} value={values.email} onChange={handleChange}/>
                    <InputField id={"salary"} placeholder={"Salary"} value={values.salary} onChange={handleChange}/>
                    <Button type={"submit"} onSubmit={handleSubmit} label={"Add Employee"} condition={"primary"} isDisabled={isSubmitting || !isValid}/>
                </form>
            </div>
        </div>
        <Alert successMessage={successMessage} errorMessage={errorMessage} setSuccessMessage={setSuccessMessage} setErrorMessage={setErrorMessage}/>
    </div>
    </>
  )
}
