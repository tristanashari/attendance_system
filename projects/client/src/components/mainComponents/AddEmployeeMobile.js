import React, {useState} from 'react'
import { useFormik } from 'formik';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import * as Yup from "yup"
import axios from '../../api/axios';
import emailPic from "../../assets/Sent Message-bro.png"
import { NavbarAdmin } from '../subComponents/HomeAdmin/NavbarAdmin';

export const AddEmployeeMobile = () => {
    const [errMsg, setErrMsg] = useState("")

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
    <NavbarAdmin />
    <div className="flex justify-center text-center font-miriam font-bold mt-6">
        Set a salary and send an email to create an account for your employee
    </div>
    <div className="flex justify-center my-6">
        <img src={emailPic} alt="email pic" className="w-56 h-56" />
    </div>
    <div className="w-full bg-slate-400 px-2 py-6">
    {errMsg ? (
        <div className="w-full bg-red-200 text-red-700 h-10 flex justify-center items-center mx-auto rounded-md mb-3">
            <p className="bg-inherit">{errMsg}</p>
        </div>) : null}
        <form onSubmit={formik.handleSubmit} className="w-full mx-auto">
            <div className="w-full flex flex-col gap-2 justify-center">
            <FormControl className="w-full" isInvalid={formik.errors.email}>
                <div className="font-inter text-black">Email</div>
                <input
                    onChange={handleForm}
                    placeholder="name@email.com"
                    type="text"
                    name="email"
                    className="w-full bg-blue-secondary rounded-md border-none"
                    autoComplete="off"
                    value={formik.values.email}
                />
                <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">{formik.errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl className="w-full" isInvalid={formik.errors.salary}>
                <div className="font-inter text-black">Salary</div>
                <input
                    onChange={handleForm}
                    placeholder="7000000"
                    type="number"
                    name="salary"
                    className="w-full bg-blue-secondary rounded-md border-none"
                    autoComplete="off"
                    value={formik.values.salary}
                />
            <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">{formik.errors.password}</FormErrorMessage>
            </FormControl>
                <div className="">
                      <button type="submit" className="w-full mt-3 bg-blue-600 text-white font-inter drop-shadow-md h-10 rounded-md">
                        Add Employee
                      </button>
                </div>
            </div>
        </form>
    </div>
    </>
  )
}
