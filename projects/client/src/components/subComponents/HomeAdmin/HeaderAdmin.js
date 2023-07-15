import React, {useState, useEffect} from 'react'
import dayjs from "dayjs"
import { useFormik } from 'formik'
import { FormControl, FormErrorMessage } from '@chakra-ui/react'
import emailPic from "../../../assets/Sent Message-bro.png"
import axios from "../../../api/axios"
import * as Yup from "yup"
import { Link } from 'react-router-dom'

export const HeaderAdmin = () => {
    const currentDate = dayjs().format("DD MMM YYYY")
    const [currentTime, setCurrentTime] = useState(dayjs().format('HH:mm'));
    const [errMsg, setErrMsg] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addEmployee = async (values, { setStatus, setValues }) => {
    try {
      const response = await axios.post("/auth/employee-registration", values, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        setStatus({ success: true });
        setValues({
          email: "",
          salary: "",
        });
        setStatus({
          success: true,
          message:
            "New Employee Has Been Registered",
        });
        setErrMsg("")
      } else {
        throw new Error("Registration Failed");
      }
    } catch (err) {
      if (!err.response) {
        setErrMsg("No Server Response");
        setValues({
          email: "",
          salary: "",
        });
      } else if (err.response?.data?.message === "email already used") {
        setErrMsg("Email is already used");
      } else {
        setErrMsg("Registration Failed");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      salary: "",
    },
    onSubmit: addEmployee,
    validationSchema: Yup.object().shape({
      email: Yup.string().required(),
      salary: Yup.string().required(),
    }),
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handleForm = (event) => {
    const { target } = event;
    formik.setFieldValue(target.name, target.value);
  };
  return (
    <>
    <div className="grid grid-rows-2 lg:grid lg:grid-rows-1 lg:grid-cols-4 w-72 lg:w-9/12 mx-auto h-24 lg:h-40 my-6 lg:mt-16">
        <div className="row-span-1 lg:col-span-1 flex justify-between items-center px-2 lg:flex lg:flex-col lg:justify-center lg:bg-blue-background lg:text-white lg:rounded-md">
            <div className="font-miriam font-bold text-lg">{currentDate.toUpperCase()}</div>
            <div className="font-miriam font-bold text-lg lg:text-4xl">{currentTime}</div>
        </div>
        <div className="row-span 1 lg:col-span-3 px-2 flex justify-center items-center">
            <Link to="/add-employee" className="w-full lg:hidden"><button className="h-10 w-full bg-blue-600 text-white lg:hidden drop-shadow-md font-inter rounded-md">Add New Employee</button></Link>
            <div className="hidden lg:grid lg:grid-cols-4 lg:h-full lg:w-full">
                <div className="hidden lg:block lg:col-span-1 lg:flex lg:justify-center lg:items-center">
                    <img src={emailPic} alt="send email pic" className="h-36 w-36" />
                </div>
                <div className="hidden lg:block lg:col-span-1 lg:flex lg:flex-col lg:gap-1 justify-center">
                    <div className="font-inter text-lg font-medium text-blue-background">Add New Employee</div>
                    <div className="font-miriam font-bold text-black">Set a salary and send an email to create an account for your employee</div>
                </div>
                <div className="hidden lg:block lg:col-span-2 lg:flex lg:flex-col gap-2 lg:justify-center lg:px-2">
                <form onSubmit={formik.handleSubmit} className="w-full mx-auto w-60">
                <div className="hidden w-full lg:block lg:col-span-2 lg:flex lg:flex-col gap-2 lg:justify-center">
                <FormControl
                      className="w-full"
                      isInvalid={formik.errors.email}
                    >
                      <input
                        onChange={handleForm}
                        placeholder="name@email.com"
                        type="text"
                        name="email"
                        className="w-full bg-blue-secondary rounded-md border-none"
                        autoComplete="off"
                        value={formik.values.email}
                      />
                      <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.email}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      className="w-full"
                      isInvalid={formik.errors.salary}
                    >
                      <input
                        onChange={handleForm}
                        placeholder="7000000"
                        type="number"
                        name="salary"
                        className="w-full bg-blue-secondary rounded-md border-none"
                        autoComplete="off"
                        value={formik.values.salary}
                      />
                    <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <div className="">
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-inter drop-shadow-md h-10 rounded-md"
                      >
                        Add Employee
                      </button>
                    </div>
                  </div>
                </form>
                </div>
            </div>
        </div>
    </div>
    {errMsg ? (
        <div className="lg:w-9/12 bg-red-200 text-red-700 h-10 flex justify-center items-center mx-auto rounded-md">
            <p className="bg-inherit">{errMsg}</p>
        </div>) : null}
    </>
  )
}
