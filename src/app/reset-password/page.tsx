"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!token) {
      toast.error("Invalid or missing reset link!");
      return;
    }

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`/api/reset-password/${token}`, {
        token,
        password,
        confirmPassword,
      });

      toast.success(res.data.message || "Password updated successfully!");
      router.push("/login");
    } catch (error: any) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Reset failed"
        : "Reset failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen justify-center items-center flex-col px-4">
      <h1 className="my-4 text-xl font-semibold text-gray-700">
        Reset Password
      </h1>

      <div className="bg-white border border-gray-100 rounded-lg sm:w-full sm:max-w-md p-6 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              placeholder="Enter new password"
              onChange={handleChange}
              className="block w-full rounded-md text-base outline-none placeholder:text-gray-400 bg-gray-100 border border-gray-200 py-2 px-3 mt-1"
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              placeholder="Confirm new password"
              onChange={handleChange}
              className="block w-full rounded-md text-base outline-none placeholder:text-gray-400 bg-gray-100 border border-gray-200 py-2 px-3 mt-1"
            />
            <div
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-500 cursor-pointer"
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center rounded-md bg-indigo-500 text-white font-semibold py-2 px-4 hover:bg-indigo-600 disabled:opacity-60"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}