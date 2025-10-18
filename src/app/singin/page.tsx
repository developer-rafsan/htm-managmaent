"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from 'react-hot-toast';
import axios from "axios";

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  position: string;
  blood: string,
  number: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export default function SinginPage() {
  // for password show and hidden
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setshowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    "firstName": "",
    "lastName": "",
    "username": "",
    "address": "",
    "city": "",
    "state": "",
    "zip": "",
    "position": "",
    "blood": "",
    "number": "",
    "email": "",
    "password": "",
    "confirmPassword": ""
  })

  // onChange handler
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };


  // handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // check input fill
    const requiredFields = [
      "firstName",
      "lastName",
      "username",
      "address",
      "city",
      "state",
      "zip",
      "position",
      "blood",
      "number",
      "email",
      "password",
      "confirmPassword"
    ] as const;

    const emptyField = requiredFields.find(
      (field) => !(formData as any)[field]
    );

    if (emptyField) {
      toast.error(`Please fill in the ${emptyField} field`);
      setLoading(false);
      return;
    }

    // check confirm password
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!')
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/signin", formData);
      toast.success("Sign in successful!");
      // optional: redirect user
      window.location.href = "/";
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Sign in failed";
        toast.error(message);
      } else {
        toast.error("Sign in failed");
      }
    } finally {
      setLoading(false);
    }
  };


  const validateStep = (step: number) => {
    // Email & Phone validation regex
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidBDPhone = (number: string) => /^(?:\+88)?01[3-9]\d{8}$/.test(number);

    if (step === 1) {
      const required: (keyof FormData)[] = [
        "firstName",
        "lastName",
        "username",
        "address",
        "city",
        "state",
        "zip",
      ];
      const emptyField = required.find((field) => !formData[field]);
      if (emptyField) {
        toast.error(`Please fill in the ${emptyField} field`);
        return false;
      }
    }

    if (step === 2) {
      const required: (keyof FormData)[] = ["position", "blood"];
      const emptyField = required.find((field) => !formData[field]);
      if (emptyField) {
        toast.error(`Please fill in the ${emptyField} field`);
        return false;
      }
    }

    if (step === 3) {
      const required: (keyof FormData)[] = ["email", "number", "password", "confirmPassword"];
      const emptyField = required.find((field) => !formData[field]);
      if (emptyField) {
        toast.error(`Please fill in the ${emptyField} field`);
        return false;
      }

      // Email validation
      if (!isValidEmail(formData.email)) {
        toast.error("Please enter a valid email address");
        return false;
      }

      // BD phone validation
      if (!isValidBDPhone(formData.number)) {
        toast.error("Please enter a valid Bangladeshi phone number (e.g. 01XXXXXXXXX or +8801XXXXXXXXX)");
        return false;
      }
    }

    return true;
  };


  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.min(prev - 1, 3));
  };


  return (
    <>
      <div className="flex h-screen justify-center items-center flex-col">
        <h1 className="my-4 text-xl font-medium">Create Employer ID</h1>
        <div className="bg-white border border-gray-100 rounded-lg sm:w-full sm:max-w-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* this is a 1 step */}
            {
              currentStep === 1 &&
              <>
                <div className="mb-2.5 flex justify-between gap-2.5">
                  <div className="w-full">
                    <label htmlFor="first-name" className="block text-sm/6 font-medium capitalize">
                      First Name
                    </label>
                    <input
                      id="first-name"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      placeholder="Enter your first name"
                      onChange={handleChange}
                      className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="last-name" className="block text-sm/6 font-medium capitalize">
                      last Name
                    </label>
                    <input
                      id="last-name"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      placeholder="Enter your last name"
                      onChange={handleChange}
                      className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                    />
                  </div>
                </div>

                <div className="mb-2.5">
                  <label htmlFor="username" className="block text-sm/6 font-medium capitalize">
                    username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    placeholder="username"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                </div>

                <div className="mb-2.5">
                  <label htmlFor="address" className="block text-sm/6 font-medium capitalize">
                    present address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    placeholder="address"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                </div>

                <div className="flex gap-2 mb-2.5">
                  <div>
                    <label htmlFor="city" className="block text-sm/6 font-medium capitalize">
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      placeholder="city"
                      onChange={handleChange}
                      className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm/6 font-medium capitalize">
                      State / Province
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      placeholder="state"
                      onChange={handleChange}
                      className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="zip" className="block text-sm/6 font-medium capitalize">
                      ZIP / Postal Code
                    </label>
                    <input
                      id="zip"
                      name="zip"
                      type="text"
                      value={formData.zip}
                      placeholder="zip"
                      onChange={handleChange}
                      className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                    />
                  </div>
                </div>
              </>
            }


            {/* this is 2 step */}
            {
              currentStep === 2 &&
              <>
                <div className="mb-2.5">
                  <label htmlFor="position" className="block text-sm/6 font-medium capitalize">
                    position
                  </label>
                  <select
                    onChange={handleChange}
                    value={formData.position}
                    className="block w-full rounded-md text-base outline-none bg-gray-100 border border-gray-200 py-1 px-3 mt-1"
                    name="position"
                    id="position"
                  >
                    <option value="">Select your position</option>
                    <option value="web developer">Web Developer</option>
                    <option value="web designer">Web Designer</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="blood" className="block text-sm/6 font-medium capitalize">
                    blood group
                  </label>
                  <input
                    id="blood"
                    name="blood"
                    type="text"
                    value={formData.blood}
                    placeholder="blood"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                </div>
              </>
            }


            {/* this is 3 step */}
            {
              currentStep === 3 &&
              <>
                <div className="mb-2.5">
                  <label htmlFor="email" className="block text-sm/6 font-medium capitalize">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    autoComplete="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                </div>

                <div className="mb-2.5">
                  <label htmlFor="number" className="block text-sm/6 font-medium capitalize">
                    number
                  </label>
                  <input
                    id="number"
                    name="number"
                    type="number"
                    value={formData.number}
                    placeholder="Enter your number"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                </div>

                <div className="mb-2.5 relative">
                  <label htmlFor="password" className="block text-sm/6 font-medium capitalize">
                    password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                  <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-500 cursor-pointer">{!showPassword ? <FaEyeSlash /> : <FaEye />}</div>
                </div>

                <div className="mb-4 relative">
                  <label htmlFor="confirmPassword" className="block text-sm/6 font-medium capitalize">
                    confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    placeholder="Enter your confirm password"
                    onChange={handleChange}
                    className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-0.5 px-3 mt-1"
                  />
                  <div onClick={() => setshowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-gray-500 cursor-pointer">{!showConfirmPassword ? <FaEyeSlash /> : <FaEye />}</div>
                </div>
              </>
            }

            <div className="mt-6 flex gap-4 justify-end">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex justify-center rounded-md bg-gray-300 text-sm/6 font-semibold text-black py-1 px-4 cursor-pointer"
                >
                  Previous
                </button>
              )}

              {currentStep >= 1 && currentStep < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex justify-center rounded-md bg-indigo-500 text-sm/6 font-semibold text-white py-1 px-4 cursor-pointer"
                >
                  Next
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex justify-center rounded-md bg-indigo-500 text-sm/6 font-semibold text-white py-1 px-4 cursor-pointer"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              )}

            </div>
          </form>
        </div>
        <p className="text-center mt-2 text-sm/6">have an account? <a className="text-indigo-600" href="/login">Login</a></p>
      </div>
    </>
  );
}