import React, {useState} from 'react'
import axios from '../../api/axios'
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import {useFormik} from 'formik'
import * as Yup from 'yup'
import { EyeIcon } from "@heroicons/react/24/outline";
import icon from "../../assets/Icon.png"
import setPasswordPic from "../../assets/Onboarding-bro.png"
import { useParams, useNavigate } from 'react-router-dom';

export const SetPassword = () => {
    const [errMsg, setErrMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {setPasswordToken} = useParams()
    const navigate = useNavigate()
  
    const setPassword = async (values, { setStatus, setValues }) => {
      try {
        const response = await axios.post(`/auth/set-password?token=${setPasswordToken}`, values, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200) {
          setStatus({ success: true });
          setValues({
            fullName: "",
            dateOfBirth: "",
            password: "",
          });
          setStatus({
            success: true,
            message:
              "Password has been set.",
          });
          setErrMsg("")
        } else {
          throw new Error("Set Password Failed");
        }
      } catch (err) {
        if (!err.response) {
          setErrMsg("No Server Response");
          setValues({
            fullName: "",
            dateOfBirth: "",
            password: "",
          });
        } else if (err.response?.data?.message === "invalid token") {
          setErrMsg("invalid token");
        } else {
          setErrMsg("Set Password Failed");
          console.log(err)
        }
      }
    };
  
    const formik = useFormik({
      initialValues: {
        fullName: "",
        dateOfBirth: "",
        password: "",
      },
      onSubmit: setPassword,
      validationSchema: Yup.object().shape({
        fullName: Yup.string(),
        dateOfBirth: Yup.string(),
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

    const handleSave = async() => {
        setTimeout(() => {
            navigate("/");
          }, 3000);
    }
  return (
    <>
    <div className="flex justify-center mx-auto lg:grid lg:grid-cols-2 lg:w-full lg:h-screen h-screen">
        <div className="lg:col-span-1 lg:bg-blue-background pt-24">
            <div className="hidden lg:block lg:w-96 lg:mx-auto lg:text-5xl lg:text-gold lg:mb-4 lg:font-miriam">Welcome to Attendee!</div>
            <div className="hidden lg:block lg:w-96 lg:mx-auto lg:text-white lg:mb-12 lg:font-inter">Please fill in your personal details and set your password to continue</div>
            <div className="hidden lg:block lg:w-96 lg:h-96 lg:mx-auto">
                <img src={setPasswordPic} alt="onBoarding pic" className="hidden lg:block lg:w-96 lg:h-96"/>
            </div>
        </div>
        <div className="flex flex-col justify-center lg:col-span-1">
        <div className="w-80 flex bg-slate-400 justify-center items-center mb-6 lg:hidden">
            <div className="mx-auto w-60 my-10 flex justify-center my-30">
                <img src={icon} alt="logo" className="w-16 h-16"/>
            </div>
            <div className="flex flex-col gap-1">
                <div className="font-inter text-blue-background text-xl font-bold">Welcome to Attendee!</div>
                <div className="font-inter text-gold">Please fill in your personal details and set your password to continue</div>
            </div>
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
                    <div className="font-inter text-lg text-blue-background mb-2">Personal Details</div>
                    <div className="font-inter text-black">Full Name</div>
                      <input
                        onChange={handleForm}
                        type="text"
                        name="fullName"
                        className="w-full rounded-md bg-blue-secondary border-none mb-3"
                        autoComplete="off"
                        value={formik.values.fullName}
                      />
                      <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.fullName}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      className="w-full"
                      isInvalid={formik.errors.email}
                    >
                    <div className="font-inter text-black">Date of Birth</div>
                      <input
                        onChange={handleForm}
                        type="text"
                        name="dateOfBirth"
                        className="w-full rounded-md bg-blue-secondary border-none mb-3"
                        autoComplete="off"
                        value={formik.values.dateOfBirth}
                      />
                      <FormErrorMessage className="text-red-500 text-sm font-medium mx-3">
                        {formik.errors.fullName}
                      </FormErrorMessage>
                    </FormControl>
                    <FormControl
                      className="w-full mt-6"
                      isInvalid={formik.errors.password}
                    >
                    <div className="font-inter text-lg text-blue-background mb-2">Set Password</div>
                    <div className="font-inter text-black">Password</div>
                      <input
                        onChange={handleForm}
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
                      <button onClick={handleSave}
                        type="submit"
                        className="w-full bg-slate-600 rounded-md h-10 bg-blue-600 text-white drop-shadow-lg font-inter"
                      >
                        Save & Continue
                      </button>
                    </div>
                  </div>
                </form>
                </div>
    </div>
    </>
  )
}
