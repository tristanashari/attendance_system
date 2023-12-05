import React, {useState} from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { useParams } from 'react-router-dom'
import { HiEye, HiEyeOff} from 'react-icons/hi'
import setPasswordPic from '../../assets/Onboarding-bro.png'
import Alert from '../../components/Alert'
import { setPassword } from '../../api/auth'
import InputField from '../../components/InputField'
import Button from '../../components/Button'
import logo from '../../assets/AttendeeNavWhite.png'


export default function SetPassword() {
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const {setPasswordToken} = useParams()

    const onSubmit = async(values, actions) => {
        try{
            const response = await setPassword(values, setPasswordToken)
            if(response.status === 200){
                actions.resetForm()
                setErrorMessage("")
                setSuccessMessage(response.data?.message)
            }
        }catch(error){
            if(error.response.status === 500){
                setErrorMessage("Server Error")
            } else if(error.response.data?.message){
                setErrorMessage(error.response.data?.message)
            }
        }
    }

    const setPasswordSchema = yup.object().shape({
        fullName: yup.string().required("Full name is required"),
        dateOfBirth: yup.string().required("Date of birth is required"),
        password: yup.string().required("Password is required"),
        confirmPassword: yup.string().required("Confirm password is required")
    })

    const {values, errors, touched, handleChange, handleSubmit, handleBlur} = useFormik({
        initialValues: {
            fullName: "",
            dateOfBirth: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: setPasswordSchema,
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
                <div>
                    <img src={logo} alt="Attendee" />
                </div>
                <div className='flex flex-col'>
                    <span className='text-xl text-white font-miriam'>Welcome!</span>
                    <span className='font-inter text-white'>Please set your account by filling in your full name, date of birth, and your password</span>         
                </div>
                <div className='w-9/12'>
                    <img src={setPasswordPic} alt="Set Your Password" />
                </div>
            </div>
        </div>
        <div className='flex flex-col gap-4 justify-center items-center w-10/12 lg:w-7/12 lg:mx-auto'>
            <Alert successMessage={successMessage} errorMessage={errorMessage} setErrorMessage={setErrorMessage} setSuccessMessage={setSuccessMessage}/>
            <form onSubmit={handleSubmit} autoComplete='off' className='flex flex-col justify-center items-center w-full'>
                <div className='flex flex-col gap-2 w-full relative'>
                    <div>
                        <label htmlFor='fullName' className='text-sm font-inter text-blue-background'>Full Name</label>
                        <InputField value={values.fullName} id={"fullName"} onChange={handleChange} onBlur={handleBlur} type={"text"} />
                        {errors.fullName && touched.fullName && (<span className='font-inter text-sm text-red-500'>{errors.fullName}</span>)}
                    </div>
                    <div>
                        <label htmlFor='dateOfBirth' className='text-sm font-inter text-blue-background'>Date of Birth</label>
                        <InputField value={values.dateOfBirth} id={"dateOfBirth"} onChange={handleChange} onBlur={handleBlur} type={"date"} />
                        {errors.dateOfBirth && touched.dateOfBirth && (<span className='font-inter text-sm text-red-500'>{errors.dateOfBirth}</span>)}
                    </div>
                    <div>
                        <div className='relative'>
                            <label htmlFor='password' className='text-sm font-inter text-blue-background'>Password</label>
                            <InputField value={values.password} id={"password"} onChange={handleChange} onBlur={handleBlur} type={showPassword ? "text" : "password"} className="relative" />
                            <div onClick={togglePassword} className='absolute right-2 bottom-2 text-blue-background cursor-pointer'>
                                {showPassword ? (<HiEyeOff className='h-6 w-6'/>) : (<HiEye className='h-6 w-6'/>)}
                            </div>
                        </div>
                        {errors.password && touched.password && (<span className='font-inter text-sm text-red-500'>{errors.password}</span>)}
                    </div>
                    <div>
                        <label htmlFor='confirmPassword' className='text-sm font-inter text-blue-background'>Confirm Password</label>
                        <InputField value={values.confirmPassword} id={"confirmPassword"} onChange={handleChange} onBlur={handleBlur} type={"password"} />
                        {errors.confirmPassword && touched.confirmPassword && (<span className='font-inter text-sm text-red-500'>{errors.confirmPassword}</span>)}
                    </div>
                </div>
                <div className='flex flex-col w-full mt-6'>
                    <Button type={"submit"} condition={"primary"} label={"Set Your Account"} onClick={handleSubmit}/>
                </div>
            </form>
        </div>
    </div>
    </>
  )
}
