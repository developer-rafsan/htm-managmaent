"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post("/api/login", { email, password });
      toast.success("Login successful!");
      // Redirect after success
      window.location.href = "/";
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Login failed";
        toast.error(message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center flex-col">
      <h1 className="my-4 text-xl font-medium">Login to Your Account</h1>

      <div className="bg-white border border-gray-100 rounded-lg sm:w-full sm:max-w-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-2.5">
            <label
              htmlFor="email"
              className="block text-sm/6 font-medium capitalize"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
              className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-1 px-3 mt-1"
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium capitalize"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-1 px-3 mt-1"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {!showPassword ? <FaEyeSlash /> : <FaEye />}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex justify-center rounded-md bg-indigo-500 text-sm/6 font-semibold text-white py-1.5 px-4 cursor-pointer w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      <p className="text-center mt-2 text-sm/6">
        Don’t have an account?{" "}
        <a className="text-indigo-600" href="/singin">
          Register
        </a>
      </p>
    </div>
  );
}
