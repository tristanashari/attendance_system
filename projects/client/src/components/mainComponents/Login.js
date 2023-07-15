import React, { useState } from 'react'
import axios from 'axios'
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { EyeIcon } from "@heroicons/react/24/outline";
import logo from "../../assets/Attendee Logo.png"
import loginPic from "../../assets/Login.png"


export const Login = () => {
    const navigate = useNavigate();
  
    const [errMsg, setErrMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
  
    const loginUser = async (values, { setStatus, setValues }) => {
      try {
        const response = await axios.post("http://localhost:8000/api/auth/login", values, {
          headers: { "Content-Type": "application/json" },
        });
  
        const token = response.data?.accessToken;
        const roleId = response.data?.data?.roleId
        if (response.status === 200) {
          setStatus({ success: true });
          setValues({
            email: "",
            password: "",
          });
          setStatus({
            success: true,
            message:
              "You are logged in.",
          });
          if (roleId === 1){
            navigate("/admin");
          }
          if (roleId === 2){
            navigate("/employee")
          }
          localStorage.setItem("token", token);
        } else {
          throw new Error("Log in Failed");
        }
      } catch (err) {
        if (!err.response) {
          setErrMsg("No Server Response");
          setValues({
            email: "",
            password: "",
          });
        } else if (err.response?.data?.message === "Login failed. Email not found") {
          setErrMsg("Email Not Found");
        } else if (err.response?.data?.message === "Login failed. Incorrect Password") {
          setErrMsg("Incorrect Password");
        } else {
          setErrMsg("Log in failed");
        }
      }
    };
  
    const formik = useFormik({
      initialValues: {
        email: "",
        password: "",
      },
      onSubmit: loginUser,
      validationSchema: Yup.object().shape({
        email: Yup.string().required(),
        password: Yup.string().required(),
      }),
      validateOnChange: false,
      validateOnBlur: false,
    });
  
    const handleForm = (event) => {
      const { target } = event;
      formik.setFieldValue(target.name, target.value);
    };
  
    const togglePassword = () => {
      setShowPassword(!showPassword);
    };
  
  return (
    <>
    <div className="flex justify-center mx-auto lg:grid lg:grid-cols-2 lg:w-full lg:h-screen h-screen">
        <div className="lg:col-span-1 lg:bg-blue-background pt-24">
            <div className="hidden lg:block lg:w-96 lg:mx-auto lg:text-5xl lg:text-gold lg:mb-4 lg:font-miriam">Attendee</div>
            <div className="hidden lg:block lg:w-96 lg:mx-auto lg:text-white lg:mb-12 lg:font-inter">Your attendance tracker</div>
            <div className="hidden lg:block lg:w-96 lg:h-96 lg:mx-auto">
                <img src={loginPic} alt="login pic" className="hidden lg:block lg:w-96 lg:h-96"/>
            </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-1">
        <div className="mx-auto w-60 my-10 flex justify-center my-30">
            <img src={logo} alt="logo"/>
        </div>
        <form onSubmit={formik.handleSubmit} className="mx-auto w-60">
        {errMsg ? (
            <div className="w-full bg-red-200 text-red-700 h-10 flex justify-center items-center mt-2 lg:w-full rounded-md mb-3">
                <p className="bg-inherit">{errMsg}</p>
            </div>
                  ) : null}
                <div className="">
                <FormControl
                      className="w-full"
                      isInvalid={formik.errors.email}
                    >
                      <input
                        onChange={handleForm}
                        placeholder="email"
                        type="text"
                        name="email"
                        className="w-full rounded-md bg-blue-secondary border-none mb-3"
                        autoComplete="off"
                        value={formik.values.email}
                      />
                      <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.email}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      className="w-full"
                      isInvalid={formik.errors.password}
                    >
                      <input
                        onChange={handleForm}
                        placeholder="password"
                        type= {showPassword ? "text" : "password"}
                        name="password"
                        className="w-full rounded-md bg-blue-secondary border-none"
                        autoComplete="off"
                        value={formik.values.password}
                      />
                      <button
                        type="button"
                        className="w-full flex justify-end rounded-md items-center mt-1 mb-8"
                        onClick={togglePassword}
                      >
                        <span className="flex font-inter">
                          show password <EyeIcon className="w-5" />
                        </span>
                      </button>
                    <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.password}
                      </FormErrorMessage>
                    </FormControl>

                    <div className="">
                      <button
                        type="submit"
                        className="w-full bg-slate-600 rounded-md h-10 bg-blue-600 text-white drop-shadow-lg font-inter"
                      >
                        Log in
                      </button>
                    </div>
                  </div>
                </form>
                </div>
    </div>
    </>
  )
}
