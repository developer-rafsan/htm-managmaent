"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password, confirmPassword } = formData;

        if (!email || !password || !confirmPassword) {
            toast.error("Please fill in all fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/api/user/update/password", { email, password, confirmPassword });
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
        <div className="flex h-screen justify-center items-center flex-col">
            <h1 className="my-4 text-xl font-semibold text-gray-700">Reset Password</h1>

            <div className="bg-white border border-gray-100 rounded-lg sm:w-full sm:max-w-md p-6 shadow-md">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            placeholder="Enter your email"
                            onChange={handleChange}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-400 bg-gray-100 border border-gray-200 py-2 px-3 mt-1"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                            {!showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

                    <div className="relative">
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
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
                            {!showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>

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