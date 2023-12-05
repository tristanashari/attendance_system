import React, {useState} from 'react'
import { HiEye, HiEyeOff} from 'react-icons/hi'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import jwtDecode from 'jwt-decode'
import { login } from '../api/auth'
import loginPic from '../assets/Login.png'
import logo from '../assets/Attendee Logo.png'
import InputField from '../components/InputField'
import Button from '../components/Button'
import Alert from '../components/Alert'

export default function Login() {
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()
    const location = useLocation();
    const from = location.state?.from?.pathname ;

    const onSubmit = async(values, actions) => {
        try{
            const response = await login(values)
            if(response.status === 200){
                actions.resetForm()
                setErrorMessage("")
                setSuccessMessage(response.data?.message)
                const token = response.data?.accessToken
                localStorage.setItem("token", token)
                const decoded = jwtDecode(token)
                if(Number(decoded.role) === 1){
                    setTimeout(() => {
                        (from ? navigate(from, {replace: true}) : navigate("/admin"))
                    }, 2000)
                } else if(Number(decoded.role) === 2) {
                    setTimeout(() => {
                        (from ? navigate(from, {replace: true}) : navigate("/employee"))
                    }, 2000)
                }
            }
        }catch(error){
            if(error.response.status === 500){
                setErrorMessage("Login failed: Server Error")
            } else if(error.response.data?.message){
                setErrorMessage(error.response.data?.message)
            }
        }
    }
    const loginSchema = yup.object().shape({
        email: yup.string().email("Invalid email format").required("Email is required"),
        password: yup.string().required("Password is required")
    })
    const {values, errors, touched, handleChange, handleSubmit, handleBlur, isSubmitting } =
        useFormik({
            initialValues: {
                email: "",
                password: ""
            },
            validationSchema: loginSchema,
            onSubmit
        }) 
    const togglePassword = () => {
        setShowPassword(!showPassword)
    }
  return (
    <>
    <div className="w-full min-h-screen flex justify-center lg:grid lg:grid-cols-2">
        <div className='hidden lg:col-span-1 lg:flex lg:flex-col lg:justify-center lg:items-center bg-blue-background'>
            <div className='w-9/12 flex flex-col gap-4'>
                <span className='text-xl text-white font-miriam'>Your Attendance Tracker</span>
                <div className='w-9/12'>
                    <img src={loginPic} alt="Login Illustration" />
                </div>
            </div>
        </div>
        <div className='flex flex-col gap-4 justify-center items-center w-10/12 lg:w-7/12 lg:mx-auto'>
            <img src={logo} alt="Attendee" />
            <Alert successMessage={successMessage} errorMessage={errorMessage} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
            <form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col justify-center items-center w-full'>
                <div className='flex flex-col gap-2 w-full relative'>
                    <div>
                    <InputField value={values.email} id={"email"} onChange={handleChange} onBlur={handleBlur} placeholder={"email"} type={"text"} />
                    {errors.email && touched.email && (<span className='font-inter text-sm text-red-500'>{errors.email}</span>)}
                    </div>
                    <div>
                    <div className='relative'>
                        <InputField value={values.password} id={"password"} onChange={handleChange} onBlur={handleBlur} placeholder={"password"} type={showPassword ? "text" : "password"} className="relative" />
                        <div onClick={togglePassword} className='absolute right-2 bottom-2 text-blue-background cursor-pointer'>
                        {showPassword ? (<HiEyeOff className='h-6 w-6'/>) : (<HiEye className='h-6 w-6'/>)}
                        </div>
                    </div>
                    {errors.password && touched.password && (<span className='font-inter text-sm text-red-500'>{errors.password}</span>)}
                    </div>
                </div>
                <div className='flex flex-col w-full mt-6'>
                    <Button type={"submit"} condition={"primary"} label={"Log In"} onClick={handleSubmit} isDisabled={isSubmitting}/>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}
