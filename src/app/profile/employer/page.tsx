"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";


export default function ProfilePage() {
  const [userData, setUserData] = useState()


  const getUserDetails = async () => {
    const res = await axios.get('/api/user/getuser')
    console.log(res);
  }

  useEffect(() => {
    getUserDetails()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <button className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
    </div>
  )
}