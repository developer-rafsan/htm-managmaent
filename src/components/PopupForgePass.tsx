"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

// define type
interface PopupForgePassProps {
    setPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PopupForgePass({ setPopup }: PopupForgePassProps) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email!");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/api/reset-password", { email });

            if (res.data.success) {
                toast.success("Code sent successfully!");
            } else {
                toast.error(res.data.message || "Something went wrong!");
            }
        } catch (error: any) {
            toast.error("Failed to send code!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full fixed bg-gray-900/60 flex justify-center items-center backdrop-blur-sm ">
            <div className="bg-white border border-gray-100 rounded-lg sm:w-full sm:max-w-md p-6 relative">
                <button onClick={() => setPopup(false)} className="text-black text-xl cursor-pointer absolute z-10 right-3" type="button">
                    <IoMdClose className="" />
                </button>
                <form onSubmit={handleSubmit}>
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
                            value={email}
                            placeholder="Enter your email"
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full rounded-md text-base outline-none placeholder:text-gray-300 bg-gray-100 sm:text-sm/6 border border-gray-200 py-1 px-3 mt-1"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex justify-center rounded-md bg-indigo-500 text-sm/6 font-semibold text-white py-1.5 px-4 cursor-pointer w-full disabled:opacity-50"
                    >
                        {loading ? "Sending..." : "Send Code"}
                    </button>
                </form>
            </div>
        </div>
    );
}
